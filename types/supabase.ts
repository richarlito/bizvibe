/**
 * Supabase Database Types
 * These types should be generated using: npx supabase gen types typescript --project-id YOUR_PROJECT_ID
 * For now, we define a placeholder that can be replaced with generated types later.
 */

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
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          avatar_url: string | null;
          role: 'consumer' | 'business' | 'admin';
          preferences: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          avatar_url?: string | null;
          role?: 'consumer' | 'business' | 'admin';
          preferences?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          avatar_url?: string | null;
          role?: 'consumer' | 'business' | 'admin';
          preferences?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      businesses: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          handle: string;
          description: string | null;
          avatar_url: string | null;
          cover_url: string | null;
          category_id: string | null;
          address: Json;
          phone: string | null;
          website: string | null;
          hours: Json | null;
          rating_avg: number;
          rating_count: number;
          follower_count: number;
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          handle: string;
          description?: string | null;
          avatar_url?: string | null;
          cover_url?: string | null;
          category_id?: string | null;
          address: Json;
          phone?: string | null;
          website?: string | null;
          hours?: Json | null;
          rating_avg?: number;
          rating_count?: number;
          follower_count?: number;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          name?: string;
          handle?: string;
          description?: string | null;
          avatar_url?: string | null;
          cover_url?: string | null;
          category_id?: string | null;
          address?: Json;
          phone?: string | null;
          website?: string | null;
          hours?: Json | null;
          rating_avg?: number;
          rating_count?: number;
          follower_count?: number;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      videos: {
        Row: {
          id: string;
          business_id: string;
          mux_asset_id: string | null;
          mux_playback_id: string | null;
          thumbnail_url: string | null;
          title: string;
          description: string | null;
          duration: number | null;
          status: 'processing' | 'ready' | 'error' | 'deleted';
          category_id: string | null;
          tags: string[] | null;
          views_count: number;
          saves_count: number;
          shares_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          mux_asset_id?: string | null;
          mux_playback_id?: string | null;
          thumbnail_url?: string | null;
          title: string;
          description?: string | null;
          duration?: number | null;
          status?: 'processing' | 'ready' | 'error' | 'deleted';
          category_id?: string | null;
          tags?: string[] | null;
          views_count?: number;
          saves_count?: number;
          shares_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          mux_asset_id?: string | null;
          mux_playback_id?: string | null;
          thumbnail_url?: string | null;
          title?: string;
          description?: string | null;
          duration?: number | null;
          status?: 'processing' | 'ready' | 'error' | 'deleted';
          category_id?: string | null;
          tags?: string[] | null;
          views_count?: number;
          saves_count?: number;
          shares_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          business_id: string;
          name: string;
          description: string | null;
          price: number;
          compare_price: number | null;
          images: string[] | null;
          category: string | null;
          variants: Json;
          inventory: number;
          is_available: boolean;
          fulfillment_type: 'shipping' | 'pickup' | 'both';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          name: string;
          description?: string | null;
          price: number;
          compare_price?: number | null;
          images?: string[] | null;
          category?: string | null;
          variants?: Json;
          inventory?: number;
          is_available?: boolean;
          fulfillment_type?: 'shipping' | 'pickup' | 'both';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          name?: string;
          description?: string | null;
          price?: number;
          compare_price?: number | null;
          images?: string[] | null;
          category?: string | null;
          variants?: Json;
          inventory?: number;
          is_available?: boolean;
          fulfillment_type?: 'shipping' | 'pickup' | 'both';
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          icon: string | null;
          color: string | null;
          parent_id: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          icon?: string | null;
          color?: string | null;
          parent_id?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          icon?: string | null;
          color?: string | null;
          parent_id?: string | null;
          sort_order?: number;
          created_at?: string;
        };
      };
      saves: {
        Row: {
          id: string;
          user_id: string;
          video_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          video_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          video_id?: string;
          created_at?: string;
        };
      };
      follows: {
        Row: {
          id: string;
          user_id: string;
          business_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          business_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          business_id?: string;
          created_at?: string;
        };
      };
      conversations: {
        Row: {
          id: string;
          user_id: string;
          business_id: string;
          last_message_at: string;
          last_message_preview: string | null;
          user_unread_count: number;
          business_unread_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          business_id: string;
          last_message_at?: string;
          last_message_preview?: string | null;
          user_unread_count?: number;
          business_unread_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          business_id?: string;
          last_message_at?: string;
          last_message_preview?: string | null;
          user_unread_count?: number;
          business_unread_count?: number;
          created_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          read_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          sender_id?: string;
          content?: string;
          read_at?: string | null;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          buyer_id: string;
          business_id: string;
          stripe_payment_intent_id: string | null;
          status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
          subtotal: number;
          shipping_cost: number;
          platform_fee: number;
          total: number;
          shipping_address: Json | null;
          fulfillment_type: string;
          tracking_number: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          buyer_id: string;
          business_id: string;
          stripe_payment_intent_id?: string | null;
          status?: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
          subtotal: number;
          shipping_cost?: number;
          platform_fee: number;
          total: number;
          shipping_address?: Json | null;
          fulfillment_type: string;
          tracking_number?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          buyer_id?: string;
          business_id?: string;
          stripe_payment_intent_id?: string | null;
          status?: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
          subtotal?: number;
          shipping_cost?: number;
          platform_fee?: number;
          total?: number;
          shipping_address?: Json | null;
          fulfillment_type?: string;
          tracking_number?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          user_id: string;
          business_id: string;
          order_id: string | null;
          rating: number;
          content: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          business_id: string;
          order_id?: string | null;
          rating: number;
          content?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          business_id?: string;
          order_id?: string | null;
          rating?: number;
          content?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}

// Convenience type aliases
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Business = Database['public']['Tables']['businesses']['Row'];
export type Video = Database['public']['Tables']['videos']['Row'];
export type Product = Database['public']['Tables']['products']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type Message = Database['public']['Tables']['messages']['Row'];
export type Conversation = Database['public']['Tables']['conversations']['Row'];
export type Review = Database['public']['Tables']['reviews']['Row'];
