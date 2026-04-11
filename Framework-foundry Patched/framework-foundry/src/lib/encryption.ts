/**
 * API Key Encryption — Layaa OS
 *
 * Encrypts API keys before storing in the settings table.
 * Uses AES-GCM via Web Crypto API. The encryption key is derived from
 * a shared admin passphrase stored in localStorage (accessible to both founders).
 *
 * Both admins can decrypt because they share the same passphrase.
 * The passphrase itself is NOT the API key — it's a separate secret
 * used only for encryption/decryption.
 */

const SALT = new TextEncoder().encode("layaa-os-encryption-salt-2026");
const IV_LENGTH = 12;

async function deriveKey(passphrase: string): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: SALT, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypt a plaintext string. Returns base64-encoded ciphertext.
 */
export async function encryptValue(plaintext: string, passphrase?: string): Promise<string> {
  const pass = passphrase || localStorage.getItem("layaa_encryption_key") || "layaa-default-key-2026";
  const key = await deriveKey(pass);
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const encoded = new TextEncoder().encode(plaintext);
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);

  // Combine IV + ciphertext and base64 encode
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.length);

  return btoa(String.fromCharCode(...combined));
}

/**
 * Decrypt a base64-encoded ciphertext. Returns plaintext string.
 */
export async function decryptValue(encrypted: string, passphrase?: string): Promise<string> {
  const pass = passphrase || localStorage.getItem("layaa_encryption_key") || "layaa-default-key-2026";
  const key = await deriveKey(pass);

  const combined = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0));
  const iv = combined.slice(0, IV_LENGTH);
  const ciphertext = combined.slice(IV_LENGTH);

  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext);
  return new TextDecoder().decode(decrypted);
}

/**
 * Check if a value looks encrypted (base64 with minimum length).
 */
export function isEncrypted(value: string): boolean {
  if (value.length < 20) return false;
  try { atob(value); return true; } catch { return false; }
}
