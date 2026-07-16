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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author_id: string
          content: string
          cover_image_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          meta_description: string | null
          published: boolean
          published_at: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          meta_description?: string | null
          published?: boolean
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          meta_description?: string | null
          published?: boolean
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      code_redemptions: {
        Row: {
          code_id: string
          granted_until: string
          id: string
          redeemed_at: string
          user_id: string
        }
        Insert: {
          code_id: string
          granted_until: string
          id?: string
          redeemed_at?: string
          user_id: string
        }
        Update: {
          code_id?: string
          granted_until?: string
          id?: string
          redeemed_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "code_redemptions_code_id_fkey"
            columns: ["code_id"]
            isOneToOne: false
            referencedRelation: "partner_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      partner_codes: {
        Row: {
          code: string
          created_at: string
          duration_months: number
          expires_at: string | null
          id: string
          is_active: boolean
          max_uses: number | null
          notes: string | null
          partner_name: string
          updated_at: string
          used_count: number
        }
        Insert: {
          code: string
          created_at?: string
          duration_months?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          notes?: string | null
          partner_name: string
          updated_at?: string
          used_count?: number
        }
        Update: {
          code?: string
          created_at?: string
          duration_months?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number | null
          notes?: string | null
          partner_name?: string
          updated_at?: string
          used_count?: number
        }
        Relationships: []
      }
      prefetch_events: {
        Row: {
          created_at: string
          duration_ms: number | null
          effective_type: string | null
          event_type: string
          id: string
          pathname: string | null
          route_key: string
          save_data: boolean | null
          saved_ms: number | null
          session_id: string | null
          trigger: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          duration_ms?: number | null
          effective_type?: string | null
          event_type: string
          id?: string
          pathname?: string | null
          route_key: string
          save_data?: boolean | null
          saved_ms?: number | null
          session_id?: string | null
          trigger?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          duration_ms?: number | null
          effective_type?: string | null
          event_type?: string
          id?: string
          pathname?: string | null
          route_key?: string
          save_data?: boolean | null
          saved_ms?: number | null
          session_id?: string | null
          trigger?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          correct_answers: number | null
          created_at: string | null
          display_name: string | null
          has_premium: boolean
          id: string
          last_practice_date: string | null
          premium_expires_at: string | null
          streak_days: number | null
          total_questions_answered: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          correct_answers?: number | null
          created_at?: string | null
          display_name?: string | null
          has_premium?: boolean
          id?: string
          last_practice_date?: string | null
          premium_expires_at?: string | null
          streak_days?: number | null
          total_questions_answered?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          correct_answers?: number | null
          created_at?: string | null
          display_name?: string | null
          has_premium?: boolean
          id?: string
          last_practice_date?: string | null
          premium_expires_at?: string | null
          streak_days?: number | null
          total_questions_answered?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          correct_answer: number
          created_at: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"] | null
          explanation: string | null
          id: string
          options: Json
          question: string
          theme: Database["public"]["Enums"]["quiz_theme"]
        }
        Insert: {
          correct_answer: number
          created_at?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"] | null
          explanation?: string | null
          id?: string
          options: Json
          question: string
          theme: Database["public"]["Enums"]["quiz_theme"]
        }
        Update: {
          correct_answer?: number
          created_at?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"] | null
          explanation?: string | null
          id?: string
          options?: Json
          question?: string
          theme?: Database["public"]["Enums"]["quiz_theme"]
        }
        Relationships: []
      }
      quiz_sessions: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          correct_answers: number | null
          id: string
          session_type: string
          started_at: string | null
          theme: Database["public"]["Enums"]["quiz_theme"] | null
          total_questions: number
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          correct_answers?: number | null
          id?: string
          session_type: string
          started_at?: string | null
          theme?: Database["public"]["Enums"]["quiz_theme"] | null
          total_questions: number
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          correct_answers?: number | null
          id?: string
          session_type?: string
          started_at?: string | null
          theme?: Database["public"]["Enums"]["quiz_theme"] | null
          total_questions?: number
          user_id?: string
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      theme_progress: {
        Row: {
          correct_answers: number | null
          id: string
          mastery_level: number | null
          questions_answered: number | null
          theme: Database["public"]["Enums"]["quiz_theme"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          correct_answers?: number | null
          id?: string
          mastery_level?: number | null
          questions_answered?: number | null
          theme: Database["public"]["Enums"]["quiz_theme"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          correct_answers?: number | null
          id?: string
          mastery_level?: number | null
          questions_answered?: number | null
          theme?: Database["public"]["Enums"]["quiz_theme"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_answers: {
        Row: {
          answered_at: string | null
          id: string
          is_correct: boolean
          question_id: string
          selected_answer: number
          session_id: string | null
          user_id: string
        }
        Insert: {
          answered_at?: string | null
          id?: string
          is_correct: boolean
          question_id: string
          selected_answer: number
          session_id?: string | null
          user_id: string
        }
        Update: {
          answered_at?: string | null
          id?: string
          is_correct?: boolean
          question_id?: string
          selected_answer?: number
          session_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_answers_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "quiz_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          badge_type: Database["public"]["Enums"]["badge_type"]
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_type: Database["public"]["Enums"]["badge_type"]
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_type?: Database["public"]["Enums"]["badge_type"]
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_purchases: {
        Row: {
          amount: number
          currency: string
          id: string
          purchased_at: string
          status: string
          stripe_session_id: string | null
          user_id: string
        }
        Insert: {
          amount?: number
          currency?: string
          id?: string
          purchased_at?: string
          status?: string
          stripe_session_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          currency?: string
          id?: string
          purchased_at?: string
          status?: string
          stripe_session_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      quiz_questions: {
        Row: {
          created_at: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"] | null
          explanation: string | null
          id: string | null
          options: Json | null
          question: string | null
          theme: Database["public"]["Enums"]["quiz_theme"] | null
        }
        Insert: {
          created_at?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"] | null
          explanation?: string | null
          id?: string | null
          options?: Json | null
          question?: string | null
          theme?: Database["public"]["Enums"]["quiz_theme"] | null
        }
        Update: {
          created_at?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"] | null
          explanation?: string | null
          id?: string | null
          options?: Json | null
          question?: string | null
          theme?: Database["public"]["Enums"]["quiz_theme"] | null
        }
        Relationships: []
      }
    }
    Functions: {
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      email_queue_dispatch: { Args: never; Returns: undefined }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "user"
      badge_type:
        | "first_quiz"
        | "streak_3"
        | "streak_7"
        | "streak_30"
        | "perfect_quiz"
        | "theme_master_principes"
        | "theme_master_institutions"
        | "theme_master_droits"
        | "theme_master_histoire"
        | "theme_master_vivre"
        | "questions_50"
        | "questions_100"
        | "questions_500"
        | "exam_passed"
        | "all_themes_started"
      difficulty_level: "facile" | "moyen" | "difficile"
      quiz_theme:
        | "principes_valeurs"
        | "systeme_institutionnel"
        | "droits_devoirs"
        | "histoire_geographie"
        | "vivre_societe"
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
      app_role: ["admin", "user"],
      badge_type: [
        "first_quiz",
        "streak_3",
        "streak_7",
        "streak_30",
        "perfect_quiz",
        "theme_master_principes",
        "theme_master_institutions",
        "theme_master_droits",
        "theme_master_histoire",
        "theme_master_vivre",
        "questions_50",
        "questions_100",
        "questions_500",
        "exam_passed",
        "all_themes_started",
      ],
      difficulty_level: ["facile", "moyen", "difficile"],
      quiz_theme: [
        "principes_valeurs",
        "systeme_institutionnel",
        "droits_devoirs",
        "histoire_geographie",
        "vivre_societe",
      ],
    },
  },
} as const
