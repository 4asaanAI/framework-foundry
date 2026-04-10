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
          last_refreshed_at: string | null
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
          last_refreshed_at?: string | null
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
          last_refreshed_at?: string | null
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
      approval_queue: {
        Row: {
          agent_context: Json | null
          approval_messages: Json | null
          approver_id: string
          created_at: string | null
          escalation_id: string | null
          id: string
          notes: string | null
          status: string | null
          task_id: string
          updated_at: string | null
        }
        Insert: {
          agent_context?: Json | null
          approval_messages?: Json | null
          approver_id: string
          created_at?: string | null
          escalation_id?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          task_id: string
          updated_at?: string | null
        }
        Update: {
          agent_context?: Json | null
          approval_messages?: Json | null
          approver_id?: string
          created_at?: string | null
          escalation_id?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          task_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "approval_queue_approver_id_fkey"
            columns: ["approver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approval_queue_escalation_id_fkey"
            columns: ["escalation_id"]
            isOneToOne: false
            referencedRelation: "escalations"
            referencedColumns: ["escalation_id"]
          },
          {
            foreignKeyName: "approval_queue_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
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
      context_memories: {
        Row: {
          context_id: string
          created_at: string | null
          key: string
          memory_id: string
          source: string | null
          updated_at: string | null
          user_id: string | null
          value: string
        }
        Insert: {
          context_id: string
          created_at?: string | null
          key: string
          memory_id?: string
          source?: string | null
          updated_at?: string | null
          user_id?: string | null
          value: string
        }
        Update: {
          context_id?: string
          created_at?: string | null
          key?: string
          memory_id?: string
          source?: string | null
          updated_at?: string | null
          user_id?: string | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "context_memories_context_id_fkey"
            columns: ["context_id"]
            isOneToOne: false
            referencedRelation: "work_contexts"
            referencedColumns: ["context_id"]
          },
          {
            foreignKeyName: "context_memories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      crm_updates_log: {
        Row: {
          agent_id: string | null
          field_changed: string
          new_value: string | null
          old_value: string | null
          reason: string | null
          task_id: string
          timestamp: string | null
          update_id: string
        }
        Insert: {
          agent_id?: string | null
          field_changed: string
          new_value?: string | null
          old_value?: string | null
          reason?: string | null
          task_id: string
          timestamp?: string | null
          update_id?: string
        }
        Update: {
          agent_id?: string | null
          field_changed?: string
          new_value?: string | null
          old_value?: string | null
          reason?: string | null
          task_id?: string
          timestamp?: string | null
          update_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_updates_log_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_updates_log_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
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
          context: Json | null
          created_at: string | null
          escalated_by_agent_id: string | null
          escalation_id: string
          feedback: string | null
          reason: string
          resolved_at: string | null
          resolved_by: string | null
          status: string | null
          task_id: string | null
        }
        Insert: {
          context?: Json | null
          created_at?: string | null
          escalated_by_agent_id?: string | null
          escalation_id?: string
          feedback?: string | null
          reason: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string | null
          task_id?: string | null
        }
        Update: {
          context?: Json | null
          created_at?: string | null
          escalated_by_agent_id?: string | null
          escalation_id?: string
          feedback?: string | null
          reason?: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string | null
          task_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "escalations_escalated_by_agent_id_fkey"
            columns: ["escalated_by_agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "escalations_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      file_contents: {
        Row: {
          chunk_index: number
          content: string
          created_at: string | null
          extracted_from: string | null
          file_id: string
          file_type: string | null
          original_filename: string
          project_id: string | null
          uploaded_by: string | null
        }
        Insert: {
          chunk_index?: number
          content: string
          created_at?: string | null
          extracted_from?: string | null
          file_id?: string
          file_type?: string | null
          original_filename: string
          project_id?: string | null
          uploaded_by?: string | null
        }
        Update: {
          chunk_index?: number
          content?: string
          created_at?: string | null
          extracted_from?: string | null
          file_id?: string
          file_type?: string | null
          original_filename?: string
          project_id?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "file_contents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "file_contents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
          archive_id: string
          archived_at: string | null
          content: string | null
          conversation_id: string | null
          created_at: string | null
          original_message_id: string
          project_id: string | null
          role: string | null
        }
        Insert: {
          archive_id?: string
          archived_at?: string | null
          content?: string | null
          conversation_id?: string | null
          created_at?: string | null
          original_message_id: string
          project_id?: string | null
          role?: string | null
        }
        Update: {
          archive_id?: string
          archived_at?: string | null
          content?: string | null
          conversation_id?: string | null
          created_at?: string | null
          original_message_id?: string
          project_id?: string | null
          role?: string | null
        }
        Relationships: []
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
          project_id: string | null
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
          project_id?: string | null
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
          project_id?: string | null
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
          {
            foreignKeyName: "messages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["project_id"]
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
          added_at: string | null
          added_by: string | null
          agent_id: string
          id: string
          project_id: string
        }
        Insert: {
          added_at?: string | null
          added_by?: string | null
          agent_id: string
          id?: string
          project_id: string
        }
        Update: {
          added_at?: string | null
          added_by?: string | null
          agent_id?: string
          id?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_agents_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
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
            referencedColumns: ["project_id"]
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
        Relationships: []
      }
      project_knowledge: {
        Row: {
          chunk_count: number | null
          created_at: string | null
          extracted_text: string | null
          file_name: string
          file_size_bytes: number | null
          file_type: string | null
          knowledge_id: string
          project_id: string
          storage_path: string | null
          uploaded_by: string | null
        }
        Insert: {
          chunk_count?: number | null
          created_at?: string | null
          extracted_text?: string | null
          file_name: string
          file_size_bytes?: number | null
          file_type?: string | null
          knowledge_id?: string
          project_id: string
          storage_path?: string | null
          uploaded_by?: string | null
        }
        Update: {
          chunk_count?: number | null
          created_at?: string | null
          extracted_text?: string | null
          file_name?: string
          file_size_bytes?: number | null
          file_type?: string | null
          knowledge_id?: string
          project_id?: string
          storage_path?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_knowledge_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "project_knowledge_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      project_knowledge_chunks: {
        Row: {
          chunk_id: string
          chunk_index: number
          content: string
          created_at: string | null
          knowledge_id: string
          project_id: string
          token_count: number | null
        }
        Insert: {
          chunk_id?: string
          chunk_index: number
          content: string
          created_at?: string | null
          knowledge_id: string
          project_id: string
          token_count?: number | null
        }
        Update: {
          chunk_id?: string
          chunk_index?: number
          content?: string
          created_at?: string | null
          knowledge_id?: string
          project_id?: string
          token_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "project_knowledge_chunks_knowledge_id_fkey"
            columns: ["knowledge_id"]
            isOneToOne: false
            referencedRelation: "project_knowledge"
            referencedColumns: ["knowledge_id"]
          },
          {
            foreignKeyName: "project_knowledge_chunks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["project_id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          instructions: string | null
          is_archived: boolean | null
          name: string
          project_id: string
          updated_at: string | null
          visibility: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          instructions?: string | null
          is_archived?: boolean | null
          name: string
          project_id?: string
          updated_at?: string | null
          visibility?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          instructions?: string | null
          is_archived?: boolean | null
          name?: string
          project_id?: string
          updated_at?: string | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
          agent_escalation_count: number | null
          assigned_agent_id: string
          created_at: string
          created_by_agent_id: string | null
          created_by_profile: string | null
          crm_board_shared: boolean | null
          description: string
          due_date: string | null
          id: string
          is_recurring: boolean
          modified_by_agent_id: string | null
          project_id: string | null
          status: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at: string
        }
        Insert: {
          agent_escalation_count?: number | null
          assigned_agent_id: string
          created_at?: string
          created_by_agent_id?: string | null
          created_by_profile?: string | null
          crm_board_shared?: boolean | null
          description?: string
          due_date?: string | null
          id?: string
          is_recurring?: boolean
          modified_by_agent_id?: string | null
          project_id?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at?: string
        }
        Update: {
          agent_escalation_count?: number | null
          assigned_agent_id?: string
          created_at?: string
          created_by_agent_id?: string | null
          created_by_profile?: string | null
          crm_board_shared?: boolean | null
          description?: string
          due_date?: string | null
          id?: string
          is_recurring?: boolean
          modified_by_agent_id?: string | null
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
            foreignKeyName: "tasks_modified_by_agent_id_fkey"
            columns: ["modified_by_agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
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
      work_contexts: {
        Row: {
          context_id: string
          context_type: string
          created_at: string | null
          display_name: string
          folder_path: string | null
          last_refresh_at: string | null
          last_used_at: string | null
          project_id: string | null
          user_id: string
        }
        Insert: {
          context_id?: string
          context_type: string
          created_at?: string | null
          display_name: string
          folder_path?: string | null
          last_refresh_at?: string | null
          last_used_at?: string | null
          project_id?: string | null
          user_id: string
        }
        Update: {
          context_id?: string
          context_type?: string
          created_at?: string | null
          display_name?: string
          folder_path?: string | null
          last_refresh_at?: string | null
          last_used_at?: string | null
          project_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_contexts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "work_contexts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
