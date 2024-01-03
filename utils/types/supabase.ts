export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      corporations: {
        Row: {
          created_at: string;
          id: string;
          name: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string | null;
        };
        Relationships: [];
      };
      match_participants: {
        Row: {
          corporation_id: string;
          match_id: string;
          new_elo: number;
          old_elo: number;
          points: number;
          standing: number;
          user_id: string;
        };
        Insert: {
          corporation_id: string;
          match_id: string;
          new_elo: number;
          old_elo: number;
          points: number;
          standing: number;
          user_id: string;
        };
        Update: {
          corporation_id?: string;
          match_id?: string;
          new_elo?: number;
          old_elo?: number;
          points?: number;
          standing?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "match_participants_corporation_id_fkey";
            columns: ["corporation_id"];
            isOneToOne: false;
            referencedRelation: "corporation_stats";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "match_participants_corporation_id_fkey";
            columns: ["corporation_id"];
            isOneToOne: false;
            referencedRelation: "corporations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "match_participants_corporation_id_fkey";
            columns: ["corporation_id"];
            isOneToOne: false;
            referencedRelation: "room_stats";
            referencedColumns: ["corporation_id"];
          },
          {
            foreignKeyName: "match_participants_match_id_fkey";
            columns: ["match_id"];
            isOneToOne: false;
            referencedRelation: "matches";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "match_participants_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      matches: {
        Row: {
          created_at: string;
          id: string;
          room_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          room_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          room_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "matches_room_id_fkey";
            columns: ["room_id"];
            isOneToOne: false;
            referencedRelation: "room_stats";
            referencedColumns: ["room_id"];
          },
          {
            foreignKeyName: "matches_room_id_fkey";
            columns: ["room_id"];
            isOneToOne: false;
            referencedRelation: "rooms";
            referencedColumns: ["id"];
          },
        ];
      };
      rooms: {
        Row: {
          created_at: string;
          hashed_password: string;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          hashed_password: string;
          id?: string;
          name: string;
        };
        Update: {
          created_at?: string;
          hashed_password?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      users: {
        Row: {
          created_at: string;
          elo_rating: number;
          id: string;
          name: string;
          room_id: string | null;
        };
        Insert: {
          created_at?: string;
          elo_rating?: number;
          id?: string;
          name: string;
          room_id?: string | null;
        };
        Update: {
          created_at?: string;
          elo_rating?: number;
          id?: string;
          name?: string;
          room_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "users_room_id_fkey";
            columns: ["room_id"];
            isOneToOne: false;
            referencedRelation: "room_stats";
            referencedColumns: ["room_id"];
          },
          {
            foreignKeyName: "users_room_id_fkey";
            columns: ["room_id"];
            isOneToOne: false;
            referencedRelation: "rooms";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      corporation_stats: {
        Row: {
          id: string;
          name: string;
          total_plays: number;
          winrate: number;
        };
        Relationships: [];
      };
      rival_stats: {
        Row: {
          games_played: number | null;
          main_user_id: string | null;
          rival_name: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "match_participants_user_id_fkey";
            columns: ["main_user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      room_stats: {
        Row: {
          corporation_id: string | null;
          corporation_name: string | null;
          room_id: string | null;
          room_name: string | null;
          total_matches: number | null;
          wins: number | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      get_room_details_with_matches: {
        Args: {
          room_id: string;
        };
        Returns: {
          room_name: string;
          room_created_at: string;
          user_name: string;
          user_elo_rating: number;
          match_id: string;
          match_created_at: string;
          participant_standing: number;
          participant_elo_diff: number;
          participant_corporation_name: string;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (
      & Database[PublicTableNameOrOptions["schema"]]["Tables"]
      & Database[PublicTableNameOrOptions["schema"]]["Views"]
    )
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database } ? (
    & Database[PublicTableNameOrOptions["schema"]]["Tables"]
    & Database[PublicTableNameOrOptions["schema"]]["Views"]
  )[TableName] extends {
    Row: infer R;
  } ? R
  : never
  : PublicTableNameOrOptions extends keyof (
    & Database["public"]["Tables"]
    & Database["public"]["Views"]
  ) ? (
      & Database["public"]["Tables"]
      & Database["public"]["Views"]
    )[PublicTableNameOrOptions] extends {
      Row: infer R;
    } ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I;
  } ? I
  : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    } ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U;
  } ? U
  : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    } ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never;
