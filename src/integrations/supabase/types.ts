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
      achievements: {
        Row: {
          created_at: string
          description: string
          icon: string | null
          key: string
          metric: string
          name: string
          reward_coins: number
          reward_gems: number
          threshold: number
        }
        Insert: {
          created_at?: string
          description: string
          icon?: string | null
          key: string
          metric?: string
          name: string
          reward_coins?: number
          reward_gems?: number
          threshold?: number
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string | null
          key?: string
          metric?: string
          name?: string
          reward_coins?: number
          reward_gems?: number
          threshold?: number
        }
        Relationships: []
      }
      inventory: {
        Row: {
          created_at: string
          id: string
          item_key: string
          quantity: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_key: string
          quantity?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          item_key?: string
          quantity?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      leaderboards: {
        Row: {
          achieved_at: string
          distance: number
          id: string
          score: number
          user_id: string
          username: string
          world: string
        }
        Insert: {
          achieved_at?: string
          distance?: number
          id?: string
          score: number
          user_id: string
          username: string
          world?: string
        }
        Update: {
          achieved_at?: string
          distance?: number
          id?: string
          score?: number
          user_id?: string
          username?: string
          world?: string
        }
        Relationships: []
      }
      owned_characters: {
        Row: {
          acquired_at: string
          character_key: string
          equipped: boolean
          id: string
          user_id: string
        }
        Insert: {
          acquired_at?: string
          character_key: string
          equipped?: boolean
          id?: string
          user_id: string
        }
        Update: {
          acquired_at?: string
          character_key?: string
          equipped?: boolean
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      owned_surfboards: {
        Row: {
          acquired_at: string
          equipped: boolean
          id: string
          surfboard_key: string
          user_id: string
        }
        Insert: {
          acquired_at?: string
          equipped?: boolean
          id?: string
          surfboard_key: string
          user_id: string
        }
        Update: {
          acquired_at?: string
          equipped?: boolean
          id?: string
          surfboard_key?: string
          user_id?: string
        }
        Relationships: []
      }
      player_progress: {
        Row: {
          best_distance: number
          bosses_defeated: number
          created_at: string
          last_played_at: string | null
          level: number
          total_coins_earned: number
          total_distance: number
          total_runs: number
          updated_at: string
          user_id: string
          xp: number
        }
        Insert: {
          best_distance?: number
          bosses_defeated?: number
          created_at?: string
          last_played_at?: string | null
          level?: number
          total_coins_earned?: number
          total_distance?: number
          total_runs?: number
          updated_at?: string
          user_id: string
          xp?: number
        }
        Update: {
          best_distance?: number
          bosses_defeated?: number
          created_at?: string
          last_played_at?: string | null
          level?: number
          total_coins_earned?: number
          total_distance?: number
          total_runs?: number
          updated_at?: string
          user_id?: string
          xp?: number
        }
        Relationships: []
      }
      player_settings: {
        Row: {
          graphics_quality: string
          music_enabled: boolean
          notifications_enabled: boolean
          sound_enabled: boolean
          updated_at: string
          user_id: string
          vibration_enabled: boolean
        }
        Insert: {
          graphics_quality?: string
          music_enabled?: boolean
          notifications_enabled?: boolean
          sound_enabled?: boolean
          updated_at?: string
          user_id: string
          vibration_enabled?: boolean
        }
        Update: {
          graphics_quality?: string
          music_enabled?: boolean
          notifications_enabled?: boolean
          sound_enabled?: boolean
          updated_at?: string
          user_id?: string
          vibration_enabled?: boolean
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          coins: number
          created_at: string
          current_world: string
          gems: number
          highest_score: number
          id: string
          updated_at: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          coins?: number
          created_at?: string
          current_world?: string
          gems?: number
          highest_score?: number
          id: string
          updated_at?: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          coins?: number
          created_at?: string
          current_world?: string
          gems?: number
          highest_score?: number
          id?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      surfboards: {
        Row: {
          boost: number
          control: number
          created_at: string
          description: string | null
          key: string
          name: string
          price_coins: number
          price_gems: number
          rarity: string
          speed: number
        }
        Insert: {
          boost?: number
          control?: number
          created_at?: string
          description?: string | null
          key: string
          name: string
          price_coins?: number
          price_gems?: number
          rarity?: string
          speed?: number
        }
        Update: {
          boost?: number
          control?: number
          created_at?: string
          description?: string | null
          key?: string
          name?: string
          price_coins?: number
          price_gems?: number
          rarity?: string
          speed?: number
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_key: string
          id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          achievement_key: string
          id?: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          achievement_key?: string
          id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_key_fkey"
            columns: ["achievement_key"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["key"]
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
