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
      profiles: {
        Row: {
          correct_answers: number | null
          created_at: string | null
          display_name: string | null
          has_premium: boolean
          id: string
          last_practice_date: string | null
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
      [_ in never]: never
    }
    Enums: {
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
