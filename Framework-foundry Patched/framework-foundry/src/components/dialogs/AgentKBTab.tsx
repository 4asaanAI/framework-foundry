import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, FileText, Image, File, Loader2 } from "lucide-react";

interface AgentKBTabProps {
  agentId: string;
}

const ACCEPTED_TYPES = ".pdf,.md,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg,.txt,.csv";

export function AgentKBTab({ agentId }: AgentKBTabProps) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const { data: kbFiles, isLoading } = useQuery({
    queryKey: ["agent-kbs", agentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agent_kbs")
        .select("*")
        .eq("agent_id", agentId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const handleUpload = async (files: FileList | null) => {
    if (!files) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      try {
        // Read file content as text for text-based files
        let content = "";
        const isText = /\.(md|txt|csv|json|xml)$/i.test(file.name);
        if (isText) {
          content = await file.text();
        } else {
          // For binary files, store a placeholder — real content extraction would need server-side processing
          content = `[Binary file: ${file.name}, size: ${(file.size / 1024).toFixed(1)}KB, type: ${file.type}]`;
        }

        // Upload to storage for binary files
        let storagePath: string | null = null;
        if (!isText) {
          const path = `agent-kb/${agentId}/${Date.now()}_${file.name}`;
          const { error: uploadErr } = await supabase.storage.from("chat-attachments").upload(path, file);
          if (uploadErr) {
            toast.error(`Failed to upload ${file.name}: ${uploadErr.message}`);
            continue;
          }
          storagePath = path;
        }

        const { error } = await supabase.from("agent_kbs").insert({
          agent_id: agentId,
          filename: file.name,
          content,
          file_size: file.size,
          file_type: file.type || "application/octet-stream",
          storage_path: storagePath,
        });

        if (error) {
          toast.error(`Failed to save ${file.name}: ${error.message}`);
        } else {
          toast.success(`${file.name} added to knowledge base`);
        }
      } catch (err: any) {
        toast.error(`Error processing ${file.name}`);
      }
    }

    queryClient.invalidateQueries({ queryKey: ["agent-kbs", agentId] });
    setUploading(false);
  };

  const handleDelete = async (id: string, filename: string) => {
    const { error } = await supabase.from("agent_kbs").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success(`${filename} removed`);
      queryClient.invalidateQueries({ queryKey: ["agent-kbs", agentId] });
    }
  };

  const getIcon = (type: string) => {
    if (type.startsWith("image/")) return <Image className="h-4 w-4 text-info" />;
    if (type.includes("pdf") || type.includes("document") || type.includes("word")) return <FileText className="h-4 w-4 text-warning" />;
    return <File className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Upload files for this agent's knowledge base. Supported: PDF, MD, DOC, PPT, XLS, images.</p>
        <Button size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
          {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <Upload className="h-3.5 w-3.5 mr-1" />}
          Upload Files
        </Button>
      </div>

      <input ref={fileInputRef} type="file" multiple accept={ACCEPTED_TYPES} className="hidden"
        onChange={(e) => handleUpload(e.target.files)} />

      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {isLoading && <div className="flex justify-center py-4"><Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /></div>}
        {kbFiles?.map((file) => (
          <div key={file.id} className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border group">
            {getIcon(file.file_type)}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{file.filename}</p>
              <p className="text-xs text-muted-foreground">{(file.file_size / 1024).toFixed(1)} KB · {new Date(file.created_at).toLocaleDateString()}</p>
            </div>
            <button onClick={() => handleDelete(file.id, file.filename)}
              className="p-1 rounded text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        {!isLoading && (!kbFiles || kbFiles.length === 0) && (
          <p className="text-xs text-muted-foreground text-center py-6">No knowledge base files yet. Upload documents to give this agent context.</p>
        )}
      </div>
    </div>
  );
}
