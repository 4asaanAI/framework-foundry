-- Add branching columns to conversations
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS branch_parent_id uuid REFERENCES public.conversations(id);
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS branch_label text DEFAULT '';

-- Add parent_message_id to messages for branch points
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS parent_message_id uuid REFERENCES public.messages(id);
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS branch_index integer DEFAULT 0;
