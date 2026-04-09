export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      agent_kbs: {
        Row: {
          agent_id: string
          content: string
          created_at: string
          file_size: number
          file_type: string
          filename: string
          id: string
          storage_path: string | null
        }
        Insert: {
          agent_id: string
          content?: string
          created_at?: string
          file_size?: number
          file_type?: string
          filename: string
          id?: string
          storage_path?: string | null
        }
        Update: {
          agent_id?: string
          content?: string
          created_at?: string
          file_size?: number
          file_type?: string
          filename?: string
          id?: string
          storage_path?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_kbs_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_memories: {
        Row: {
          agent_id: string
          category: Database["public"]["Enums"]["memory_category"]
          confidence: number
          content: string
          created_at: string
          id: string
          is_compressed: boolean
          memory_type: Database["public"]["Enums"]["memory_type"]
        }
        Insert: {
          agent_id: string
          category?: Database["public"]["Enums"]["memory_category"]
          confidence?: number
          content: string
          created_at?: string
          id?: string
          is_compressed?: boolean
          memory_type?: Database["public"]["Enums"]["memory_type"]
        }
        Update: {
          agent_id?: string
          category?: Database["public"]["Enums"]["memory_category"]
          confidence?: number
          content?: string
          created_at?: string
          id?: string
          is_compressed?: boolean
          memory_type?: Database["public"]["Enums"]["memory_type"]
        }
        Relationships: [
          {
            foreignKeyName: "agent_memories_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_skills: {
        Row: {
          agent_id: string
          created_at: string
          id: string
          skill_id: string
        }
        Insert: {
          agent_id: string
          created_at?: string
          id?: string
          skill_id: string
        }
        Update: {
          agent_id?: string
          created_at?: string
          id?: string
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_skills_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      agents: {
        Row: {
          avatar_color: string
          avatar_initials: string
          budget_loaned: number
          budget_period_start: string | null
          budget_tokens: number
          budget_used: number
          canonical_role: string
          created_at: string
          created_by: string | null
          custom_api_base_url: string | null
          custom_api_key: string | null
          default_model: string
          description: string
          id: string
          is_active: boolean
          llm_provider: string
          name: string
          prompt_history: Json
          prompt_version: number
          status: Database["public"]["Enums"]["agent_status"]
          system_prompt: string
          team: Database["public"]["Enums"]["team_type"]
          updated_at: string
        }
        Insert: {
          avatar_color?: string
          avatar_initials?: string
          budget_loaned?: number
          budget_period_start?: string | null
          budget_tokens?: number
          budget_used?: number
          canonical_role: string
          created_at?: string
          created_by?: string | null
          custom_api_base_url?: string | null
          custom_api_key?: string | null
          default_model?: string
          description?: string
          id?: string
          is_active?: boolean
          llm_provider?: string
          name: string
          prompt_history?: Json
          prompt_version?: number
          status?: Database["public"]["Enums"]["agent_status"]
          system_prompt?: string
          team: Database["public"]["Enums"]["team_type"]
          updated_at?: string
        }
        Update: {
          avatar_color?: string
          avatar_initials?: string
          budget_loaned?: number
          budget_period_start?: string | null
          budget_tokens?: number
          budget_used?: number
          canonical_role?: string
          created_at?: string
          created_by?: string | null
          custom_api_base_url?: string | null
          custom_api_key?: string | null
          default_model?: string
          description?: string
          id?: string
          is_active?: boolean
          llm_provider?: string
          name?: string
          prompt_history?: Json
          prompt_version?: number
          status?: Database["public"]["Enums"]["agent_status"]
          system_prompt?: string
          team?: Database["public"]["Enums"]["team_type"]
          updated_at?: string
        }
        Relationships: []
      }
      approvals: {
        Row: {
          action_description: string
          action_payload: Json
          action_type: string
          approval_messages: Json
          conversation_id: string | null
          created_at: string
          id: string
          profile_id: string
          requesting_agent_id: string
          status: Database["public"]["Enums"]["approval_status"]
          updated_at: string
        }
        Insert: {
          action_description?: string
          action_payload?: Json
          action_type: string
          approval_messages?: Json
          conversation_id?: string | null
          created_at?: string
          id?: string
          profile_id: string
          requesting_agent_id: string
          status?: Database["public"]["Enums"]["approval_status"]
          updated_at?: string
        }
        Update: {
          action_description?: string
          action_payload?: Json
          action_type?: string
          approval_messages?: Json
          conversation_id?: string | null
          created_at?: string
          id?: string
          profile_id?: string
          requesting_agent_id?: string
          status?: Database["public"]["Enums"]["approval_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "approvals_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approvals_requesting_agent_id_fkey"
            columns: ["requesting_agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          actor_id: string
          actor_type: string
          created_at: string
          id: string
          ip_address: string | null
          payload: Json
          target_id: string | null
          target_table: string
        }
        Insert: {
          action?: string
          actor_id?: string
          actor_type?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          payload?: Json
          target_id?: string | null
          target_table?: string
        }
        Update: {
          action?: string
          actor_id?: string
          actor_type?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          payload?: Json
          target_id?: string | null
          target_table?: string
        }
        Relationships: []
      }
      connectors: {
        Row: {
          config: Json
          created_at: string
          created_by: string | null
          description: string
          id: string
          is_active: boolean
          name: string
          type: string
          updated_at: string
        }
        Insert: {
          config?: Json
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          is_active?: boolean
          name: string
          type?: string
          updated_at?: string
        }
        Update: {
          config?: Json
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          is_active?: boolean
          name?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          agent_id: string
          branch_label: string | null
          branch_parent_id: string | null
          created_at: string
          id: string
          is_archived: boolean
          is_starred: boolean
          model_used: string
          profile_id: string
          project_id: string | null
          status: Database["public"]["Enums"]["conversation_status"]
          title: string
          updated_at: string
        }
        Insert: {
          agent_id: string
          branch_label?: string | null
          branch_parent_id?: string | null
          created_at?: string
          id?: string
          is_archived?: boolean
          is_starred?: boolean
          model_used?: string
          profile_id: string
          project_id?: string | null
          status?: Database["public"]["Enums"]["conversation_status"]
          title?: string
          updated_at?: string
        }
        Update: {
          agent_id?: string
          branch_label?: string | null
          branch_parent_id?: string | null
          created_at?: string
          id?: string
          is_archived?: boolean
          is_starred?: boolean
          model_used?: string
          profile_id?: string
          project_id?: string | null
          status?: Database["public"]["Enums"]["conversation_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_branch_parent_id_fkey"
            columns: ["branch_parent_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      core_context: {
        Row: {
          agent_id: string | null
          content: string
          context_key: string
          created_at: string
          id: string
          updated_at: string
          version: number
        }
        Insert: {
          agent_id?: string | null
          content?: string
          context_key: string
          created_at?: string
          id?: string
          updated_at?: string
          version?: number
        }
        Update: {
          agent_id?: string | null
          content?: string
          context_key?: string
          created_at?: string
          id?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "core_context_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      credential_vault: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          is_configured: boolean
          name: string
          provider: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_configured?: boolean
          name: string
          provider?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_configured?: boolean
          name?: string
          provider?: string
          updated_at?: string
        }
        Relationships: []
      }
      db_health_log: {
        Row: {
          action_taken: string
          db_capacity_mb: number
          db_size_mb: number
          id: string
          occupancy_pct: number
          recorded_at: string
        }
        Insert: {
          action_taken?: string
          db_capacity_mb?: number
          db_size_mb?: number
          id?: string
          occupancy_pct?: number
          recorded_at?: string
        }
        Update: {
          action_taken?: string
          db_capacity_mb?: number
          db_size_mb?: number
          id?: string
          occupancy_pct?: number
          recorded_at?: string
        }
        Relationships: []
      }
      direct_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean
          receiver_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      escalations: {
        Row: {
          approval_id: string | null
          conversation_context: Json
          created_at: string
          feedback: string | null
          id: string
          profile_id: string
          reason: string
          requesting_agent_id: string
          resolved_by: string | null
          status: string
          task_id: string | null
          updated_at: string
        }
        Insert: {
          approval_id?: string | null
          conversation_context?: Json
          created_at?: string
          feedback?: string | null
          id?: string
          profile_id: string
          reason?: string
          requesting_agent_id: string
          resolved_by?: string | null
          status?: string
          task_id?: string | null
          updated_at?: string
        }
        Update: {
          approval_id?: string | null
          conversation_context?: Json
          created_at?: string
          feedback?: string | null
          id?: string
          profile_id?: string
          reason?: string
          requesting_agent_id?: string
          resolved_by?: string | null
          status?: string
          task_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "escalations_approval_id_fkey"
            columns: ["approval_id"]
            isOneToOne: false
            referencedRelation: "approvals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "escalations_requesting_agent_id_fkey"
            columns: ["requesting_agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "escalations_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      failed_writes: {
        Row: {
          collection: string
          created_at: string
          data: Json
          error: string
          id: string
          retry_count: number
        }
        Insert: {
          collection: string
          created_at?: string
          data?: Json
          error?: string
          id?: string
          retry_count?: number
        }
        Update: {
          collection?: string
          created_at?: string
          data?: Json
          error?: string
          id?: string
          retry_count?: number
        }
        Relationships: []
      }
      llm_providers: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          models: Json
          name: string
          provider_key: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          models?: Json
          name: string
          provider_key?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          models?: Json
          name?: string
          provider_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      message_annotations: {
        Row: {
          content: string
          created_at: string
          id: string
          message_id: string
          profile_id: string
        }
        Insert: {
          content?: string
          created_at?: string
          id?: string
          message_id: string
          profile_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          message_id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_annotations_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      message_archives: {
        Row: {
          compressed_at: string
          content: string
          id: string
          message_id: string
        }
        Insert: {
          compressed_at?: string
          content?: string
          id?: string
          message_id: string
        }
        Update: {
          compressed_at?: string
          content?: string
          id?: string
          message_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_archives_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          attachments: Json
          branch_index: number | null
          content: string
          conversation_id: string
          cost_usd: number
          created_at: string
          id: string
          is_pinned: boolean
          mention_agent_id: string | null
          model: string
          parent_message_id: string | null
          rating: number | null
          response_time_ms: number
          role: Database["public"]["Enums"]["message_role"]
          tokens_in: number
          tokens_out: number
        }
        Insert: {
          attachments?: Json
          branch_index?: number | null
          content: string
          conversation_id: string
          cost_usd?: number
          created_at?: string
          id?: string
          is_pinned?: boolean
          mention_agent_id?: string | null
          model?: string
          parent_message_id?: string | null
          rating?: number | null
          response_time_ms?: number
          role: Database["public"]["Enums"]["message_role"]
          tokens_in?: number
          tokens_out?: number
        }
        Update: {
          attachments?: Json
          branch_index?: number | null
          content?: string
          conversation_id?: string
          cost_usd?: number
          created_at?: string
          id?: string
          is_pinned?: boolean
          mention_agent_id?: string | null
          model?: string
          parent_message_id?: string | null
          rating?: number | null
          response_time_ms?: number
          role?: Database["public"]["Enums"]["message_role"]
          tokens_in?: number
          tokens_out?: number
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_mention_agent_id_fkey"
            columns: ["mention_agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_parent_message_id_fkey"
            columns: ["parent_message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          body: string
          category: Database["public"]["Enums"]["notification_category"]
          created_at: string
          id: string
          is_read: boolean
          profile_id: string
          source_agent_id: string | null
          title: string
        }
        Insert: {
          action_url?: string | null
          body?: string
          category?: Database["public"]["Enums"]["notification_category"]
          created_at?: string
          id?: string
          is_read?: boolean
          profile_id: string
          source_agent_id?: string | null
          title: string
        }
        Update: {
          action_url?: string | null
          body?: string
          category?: Database["public"]["Enums"]["notification_category"]
          created_at?: string
          id?: string
          is_read?: boolean
          profile_id?: string
          source_agent_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_source_agent_id_fkey"
            columns: ["source_agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      plugins: {
        Row: {
          context: string
          created_at: string
          created_by: string | null
          display_name: string
          id: string
          is_active: boolean
          name: string
          skills: Json
          updated_at: string
        }
        Insert: {
          context?: string
          created_at?: string
          created_by?: string | null
          display_name?: string
          id?: string
          is_active?: boolean
          name: string
          skills?: Json
          updated_at?: string
        }
        Update: {
          context?: string
          created_at?: string
          created_by?: string | null
          display_name?: string
          id?: string
          is_active?: boolean
          name?: string
          skills?: Json
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          role: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      project_agents: {
        Row: {
          agent_id: string
          created_at: string
          id: string
          project_id: string
        }
        Insert: {
          agent_id: string
          created_at?: string
          id?: string
          project_id: string
        }
        Update: {
          agent_id?: string
          created_at?: string
          id?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_agents_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_agents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_kb_chunks: {
        Row: {
          chunk_index: number
          content: string
          created_at: string
          id: string
          keywords: Json
          project_kb_id: string
        }
        Insert: {
          chunk_index?: number
          content?: string
          created_at?: string
          id?: string
          keywords?: Json
          project_kb_id: string
        }
        Update: {
          chunk_index?: number
          content?: string
          created_at?: string
          id?: string
          keywords?: Json
          project_kb_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_kb_chunks_project_kb_id_fkey"
            columns: ["project_kb_id"]
            isOneToOne: false
            referencedRelation: "project_kbs"
            referencedColumns: ["id"]
          },
        ]
      }
      project_kbs: {
        Row: {
          content: string
          created_at: string
          file_size: number
          filename: string
          id: string
          project_id: string
        }
        Insert: {
          content?: string
          created_at?: string
          file_size?: number
          filename: string
          id?: string
          project_id: string
        }
        Update: {
          content?: string
          created_at?: string
          file_size?: number
          filename?: string
          id?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_kbs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          created_by: string | null
          description: string
          id: string
          instructions: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          instructions?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          instructions?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      references: {
        Row: {
          category: string
          content: string
          created_at: string
          created_by: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          category?: string
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value?: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          description: string
          id: string
          is_active: boolean
          is_system: boolean
          name: string
          plugin: string
          sub_skills: Json | null
          trigger_keywords: string[]
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          is_active?: boolean
          is_system?: boolean
          name: string
          plugin?: string
          sub_skills?: Json | null
          trigger_keywords?: string[]
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          is_active?: boolean
          is_system?: boolean
          name?: string
          plugin?: string
          sub_skills?: Json | null
          trigger_keywords?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assigned_agent_id: string
          created_at: string
          created_by_agent_id: string | null
          created_by_profile: string | null
          description: string
          due_date: string | null
          id: string
          is_recurring: boolean
          project_id: string | null
          status: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at: string
        }
        Insert: {
          assigned_agent_id: string
          created_at?: string
          created_by_agent_id?: string | null
          created_by_profile?: string | null
          description?: string
          due_date?: string | null
          id?: string
          is_recurring?: boolean
          project_id?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at?: string
        }
        Update: {
          assigned_agent_id?: string
          created_at?: string
          created_by_agent_id?: string | null
          created_by_profile?: string | null
          description?: string
          due_date?: string | null
          id?: string
          is_recurring?: boolean
          project_id?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_agent_id_fkey"
            columns: ["assigned_agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_created_by_agent_id_fkey"
            columns: ["created_by_agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      token_usage_log: {
        Row: {
          agent_id: string
          conversation_id: string | null
          cost_usd: number
          created_at: string
          id: string
          message_id: string | null
          model: string
          profile_id: string
          tokens_in: number
          tokens_out: number
        }
        Insert: {
          agent_id: string
          conversation_id?: string | null
          cost_usd?: number
          created_at?: string
          id?: string
          message_id?: string | null
          model?: string
          profile_id: string
          tokens_in?: number
          tokens_out?: number
        }
        Update: {
          agent_id?: string
          conversation_id?: string | null
          cost_usd?: number
          created_at?: string
          id?: string
          message_id?: string | null
          model?: string
          profile_id?: string
          tokens_in?: number
          tokens_out?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      agent_status:
        | "idle"
        | "thinking"
        | "error"
        | "awaiting_approval"
        | "budget_exhausted"
      approval_status: "pending" | "approved" | "rejected" | "timeout"
      conversation_status: "active" | "budget_exhausted" | "archived"
      memory_category:
        | "client_info"
        | "decision"
        | "market_data"
        | "process"
        | "preference"
        | "company"
        | "conversation_handoff"
      memory_type: "personal" | "shared"
      message_role: "user" | "agent" | "mention_response" | "tool_result"
      notification_category:
        | "budget"
        | "health"
        | "task"
        | "approval"
        | "system"
      task_status:
        | "pending"
        | "running"
        | "completed"
        | "failed"
        | "awaiting_approval"
      team_type:
        | "founders_office"
        | "marketing"
        | "revenue"
        | "delivery"
        | "support"
        | "product"
        | "system"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      agent_status: [
        "idle",
        "thinking",
        "error",
        "awaiting_approval",
        "budget_exhausted",
      ],
      approval_status: ["pending", "approved", "rejected", "timeout"],
      conversation_status: ["active", "budget_exhausted", "archived"],
      memory_category: [
        "client_info",
        "decision",
        "market_data",
        "process",
        "preference",
        "company",
        "conversation_handoff",
      ],
      memory_type: ["personal", "shared"],
      message_role: ["user", "agent", "mention_response", "tool_result"],
      notification_category: ["budget", "health", "task", "approval", "system"],
      task_status: [
        "pending",
        "running",
        "completed",
        "failed",
        "awaiting_approval",
      ],
      team_type: [
        "founders_office",
        "marketing",
        "revenue",
        "delivery",
        "support",
        "product",
        "system",
      ],
    },
  },
} as const
