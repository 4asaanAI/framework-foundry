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
          budget_tokens: number
          budget_used: number
          canonical_role: string
          created_at: string
          created_by: string | null
          default_model: string
          description: string
          id: string
          is_active: boolean
          llm_provider: string
          name: string
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
          budget_tokens?: number
          budget_used?: number
          canonical_role: string
          created_at?: string
          created_by?: string | null
          default_model?: string
          description?: string
          id?: string
          is_active?: boolean
          llm_provider?: string
          name: string
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
          budget_tokens?: number
          budget_used?: number
          canonical_role?: string
          created_at?: string
          created_by?: string | null
          default_model?: string
          description?: string
          id?: string
          is_active?: boolean
          llm_provider?: string
          name?: string
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
            foreignKeyName: "conversations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          cost_usd: number
          created_at: string
          id: string
          is_pinned: boolean
          mention_agent_id: string | null
          model: string
          rating: number | null
          response_time_ms: number
          role: Database["public"]["Enums"]["message_role"]
          tokens_in: number
          tokens_out: number
        }
        Insert: {
          content: string
          conversation_id: string
          cost_usd?: number
          created_at?: string
          id?: string
          is_pinned?: boolean
          mention_agent_id?: string | null
          model?: string
          rating?: number | null
          response_time_ms?: number
          role: Database["public"]["Enums"]["message_role"]
          tokens_in?: number
          tokens_out?: number
        }
        Update: {
          content?: string
          conversation_id?: string
          cost_usd?: number
          created_at?: string
          id?: string
          is_pinned?: boolean
          mention_agent_id?: string | null
          model?: string
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
