/**
 * File System Access API Wrapper — Layaa OS
 *
 * Enables any agent on the Layaa AI platform to work with files in a user's
 * local folder directly from the browser. Uses the File System Access API
 * (Chrome/Edge) with graceful fallback for unsupported browsers.
 *
 * No backend/DB changes required — file handles are held in browser memory
 * and folder paths are stored in the existing work_contexts table.
 */

// ─── Types ──────────────────────────────────────────────────────────────────

export interface FileTreeNode {
  name: string;
  path: string; // relative path from project root
  kind: "file" | "directory";
  children?: FileTreeNode[];
  size?: number;
  lastModified?: number;
}

export interface FileContent {
  name: string;
  path: string;
  content: string;
  size: number;
  lastModified: number;
}

// ─── Capability Detection ───────────────────────────────────────────────────

/**
 * Check if the browser supports the File System Access API.
 * Required for local folder integration.
 */
export function isFileSystemAccessSupported(): boolean {
  return typeof window !== "undefined" && "showDirectoryPicker" in window;
}

// ─── Directory Handle Store ─────────────────────────────────────────────────

// In-memory store for directory handles
const directoryHandles = new Map<string, FileSystemDirectoryHandle>();

// IndexedDB-based persistence for directory handles (survives page refresh)
const IDB_NAME = "layaa-fs-handles";
const IDB_STORE = "handles";

async function openHandleDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => { req.result.createObjectStore(IDB_STORE); };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/**
 * Store a directory handle for a project context.
 * Persists to both in-memory map and IndexedDB.
 */
export async function storeDirectoryHandle(contextId: string, handle: FileSystemDirectoryHandle): Promise<void> {
  directoryHandles.set(contextId, handle);
  try {
    const db = await openHandleDB();
    const tx = db.transaction(IDB_STORE, "readwrite");
    tx.objectStore(IDB_STORE).put(handle, contextId);
  } catch { /* IndexedDB may not support storing handles in all browsers */ }
}

/**
 * Retrieve a stored directory handle.
 * Checks in-memory first, then IndexedDB. Re-requests permission if handle is stale.
 */
export async function getDirectoryHandleAsync(contextId: string): Promise<FileSystemDirectoryHandle | undefined> {
  // Check in-memory first
  const cached = directoryHandles.get(contextId);
  if (cached) return cached;

  // Try IndexedDB
  try {
    const db = await openHandleDB();
    const tx = db.transaction(IDB_STORE, "readonly");
    const handle = await new Promise<FileSystemDirectoryHandle | undefined>((resolve) => {
      const req = tx.objectStore(IDB_STORE).get(contextId);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(undefined);
    });

    if (handle) {
      // Re-request permission (handles may have lost permission after page refresh)
      try {
        const perm = await (handle as any).requestPermission({ mode: "readwrite" });
        if (perm === "granted") {
          directoryHandles.set(contextId, handle);
          return handle;
        }
      } catch { /* permission denied or API not available */ }
    }
  } catch { /* IndexedDB error */ }

  return undefined;
}

/**
 * Synchronous handle retrieval (in-memory only, for backward compatibility).
 */
export function getDirectoryHandle(contextId: string): FileSystemDirectoryHandle | undefined {
  return directoryHandles.get(contextId);
}

/**
 * Remove a stored directory handle.
 */
export async function clearDirectoryHandle(contextId: string): Promise<void> {
  directoryHandles.delete(contextId);
  try {
    const db = await openHandleDB();
    const tx = db.transaction(IDB_STORE, "readwrite");
    tx.objectStore(IDB_STORE).delete(contextId);
  } catch { /* ignore */ }
}

// ─── Folder Picker ──────────────────────────────────────────────────────────

/**
 * Open the native folder picker dialog.
 * Returns the folder name and handle, or null if cancelled.
 */
export async function pickFolder(): Promise<{
  name: string;
  handle: FileSystemDirectoryHandle;
} | null> {
  if (!isFileSystemAccessSupported()) {
    throw new Error("File System Access API is not supported in this browser. Please use Chrome or Edge.");
  }

  try {
    const handle = await (window as any).showDirectoryPicker({
      mode: "readwrite",
    });
    return { name: handle.name, handle };
  } catch (err: any) {
    // User cancelled the picker
    if (err.name === "AbortError") return null;
    throw err;
  }
}

// ─── File Tree Reading ──────────────────────────────────────────────────────

/**
 * Recursively read the file tree of a directory.
 * Respects .gitignore-style exclusions and skips hidden folders (except .project).
 */
export async function readFileTree(
  handle: FileSystemDirectoryHandle,
  basePath: string = "",
  maxDepth: number = 4
): Promise<FileTreeNode[]> {
  if (maxDepth <= 0) return [];

  const nodes: FileTreeNode[] = [];
  const SKIP_DIRS = new Set([
    "node_modules", ".git", ".next", ".cache", "__pycache__",
    ".DS_Store", "dist", "build", ".venv", "venv", ".idea",
  ]);

  try {
    for await (const [name, entry] of (handle as any).entries()) {
      // Skip hidden files/dirs (except .project which is ours)
      if (name.startsWith(".") && name !== ".project") continue;
      // Skip known heavy directories
      if (SKIP_DIRS.has(name)) continue;

      const path = basePath ? `${basePath}/${name}` : name;

      if (entry.kind === "directory") {
        const children = await readFileTree(entry as FileSystemDirectoryHandle, path, maxDepth - 1);
        nodes.push({ name, path, kind: "directory", children });
      } else {
        try {
          const file = await (entry as FileSystemFileHandle).getFile();
          nodes.push({
            name,
            path,
            kind: "file",
            size: file.size,
            lastModified: file.lastModified,
          });
        } catch {
          nodes.push({ name, path, kind: "file" });
        }
      }
    }
  } catch (err) {
    console.error("[Layaa FS] Error reading directory:", err);
  }

  // Sort: directories first, then files, alphabetically
  return nodes.sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === "directory" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

// ─── File Read/Write ────────────────────────────────────────────────────────

/**
 * Read a file's content by its relative path within the project folder.
 */
export async function readFileContent(
  rootHandle: FileSystemDirectoryHandle,
  relativePath: string
): Promise<FileContent> {
  const parts = relativePath.split("/").filter(Boolean);
  let currentHandle: FileSystemDirectoryHandle = rootHandle;

  // Navigate to the file's directory
  for (let i = 0; i < parts.length - 1; i++) {
    currentHandle = await currentHandle.getDirectoryHandle(parts[i]);
  }

  const fileName = parts[parts.length - 1];
  const fileHandle = await currentHandle.getFileHandle(fileName);
  const file = await fileHandle.getFile();
  const content = await file.text();

  return {
    name: fileName,
    path: relativePath,
    content,
    size: file.size,
    lastModified: file.lastModified,
  };
}

/**
 * Write content to a file by its relative path within the project folder.
 * Creates intermediate directories and the file if they don't exist.
 */
export async function writeFileContent(
  rootHandle: FileSystemDirectoryHandle,
  relativePath: string,
  content: string
): Promise<void> {
  const parts = relativePath.split("/").filter(Boolean);
  let currentHandle: FileSystemDirectoryHandle = rootHandle;

  // Create/navigate intermediate directories
  for (let i = 0; i < parts.length - 1; i++) {
    currentHandle = await currentHandle.getDirectoryHandle(parts[i], { create: true });
  }

  const fileName = parts[parts.length - 1];
  const fileHandle = await currentHandle.getFileHandle(fileName, { create: true });
  const writable = await (fileHandle as any).createWritable();
  await writable.write(content);
  await writable.close();
}

/**
 * List files matching a search query within the project folder.
 * Simple filename + content search (no indexing required).
 */
export async function searchFiles(
  rootHandle: FileSystemDirectoryHandle,
  query: string,
  maxResults: number = 10
): Promise<{ path: string; matchLine: string }[]> {
  const results: { path: string; matchLine: string }[] = [];
  const tree = await readFileTree(rootHandle, "", 3);
  const lowerQuery = query.toLowerCase();

  async function searchNode(nodes: FileTreeNode[]) {
    for (const node of nodes) {
      if (results.length >= maxResults) return;

      if (node.kind === "file") {
        // Filename match
        if (node.name.toLowerCase().includes(lowerQuery)) {
          results.push({ path: node.path, matchLine: `Filename match: ${node.name}` });
          continue;
        }
        // Content match for text files only
        const textExtensions = [".ts", ".tsx", ".js", ".jsx", ".md", ".txt", ".json", ".css", ".html", ".py", ".yaml", ".yml", ".toml", ".env", ".sh"];
        const isText = textExtensions.some(ext => node.name.endsWith(ext));
        if (isText && node.size && node.size < 500000) {
          try {
            const fileContent = await readFileContent(rootHandle, node.path);
            const lines = fileContent.content.split("\n");
            for (const line of lines) {
              if (line.toLowerCase().includes(lowerQuery)) {
                results.push({ path: node.path, matchLine: line.trim().slice(0, 200) });
                break;
              }
            }
          } catch { /* skip unreadable files */ }
        }
      } else if (node.children) {
        await searchNode(node.children);
      }
    }
  }

  await searchNode(tree);
  return results;
}

// ─── Git Integration (read-only from browser) ──────────────────────────────

export interface GitStatus {
  isGitRepo: boolean;
  branch: string | null;
  isDirty: boolean; // has uncommitted changes (approximation)
}

/**
 * Detect if a folder is a git repo and read basic status.
 * Reads .git/HEAD for branch name. Checks for uncommitted changes
 * by looking at .git/index modification time vs HEAD.
 * Lazy: only called when workspace opens, not on every tree scan.
 */
export async function getGitStatus(rootHandle: FileSystemDirectoryHandle): Promise<GitStatus> {
  try {
    const gitDir = await rootHandle.getDirectoryHandle(".git");

    // Read current branch from HEAD
    let branch: string | null = null;
    try {
      const headHandle = await gitDir.getFileHandle("HEAD");
      const headFile = await headHandle.getFile();
      const headContent = await headFile.text();
      const refMatch = headContent.trim().match(/^ref: refs\/heads\/(.+)$/);
      branch = refMatch ? refMatch[1] : headContent.trim().slice(0, 8); // detached HEAD shows short hash
    } catch { /* HEAD unreadable */ }

    // Approximate dirty check: look for MERGE_HEAD, REBASE_HEAD, or .git/index freshness
    let isDirty = false;
    try {
      // If MERGE_HEAD or CHERRY_PICK_HEAD exists, there's active work
      await gitDir.getFileHandle("MERGE_HEAD");
      isDirty = true;
    } catch {
      // No merge in progress — check index file modification time
      try {
        const indexHandle = await gitDir.getFileHandle("index");
        const indexFile = await indexHandle.getFile();
        // If index was modified in last 60 seconds, likely dirty
        isDirty = Date.now() - indexFile.lastModified < 60000;
      } catch { /* no index = probably clean or bare */ }
    }

    return { isGitRepo: true, branch, isDirty };
  } catch {
    return { isGitRepo: false, branch: null, isDirty: false };
  }
}

