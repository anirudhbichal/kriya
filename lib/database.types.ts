// Supabase Database Types for Multi-tenant E-commerce SaaS

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // Stores/Tenants table
      stores: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          owner_id: string
          name: string
          slug: string // unique subdomain: slug.kriya.com
          custom_domain: string | null // custom domain mapping
          tagline: string | null
          logo_url: string | null
          theme: 'neon' | 'soft' | 'brutal'
          currency: string
          currency_symbol: string
          announcement: string | null
          instagram_url: string | null
          twitter_url: string | null
          tiktok_url: string | null
          google_sheet_id: string | null
          google_sheet_last_sync: string | null
          is_active: boolean
          plan: 'free' | 'starter' | 'pro' | 'enterprise'
          settings: Json
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          owner_id: string
          name: string
          slug: string
          custom_domain?: string | null
          tagline?: string | null
          logo_url?: string | null
          theme?: 'neon' | 'soft' | 'brutal'
          currency?: string
          currency_symbol?: string
          announcement?: string | null
          instagram_url?: string | null
          twitter_url?: string | null
          tiktok_url?: string | null
          google_sheet_id?: string | null
          google_sheet_last_sync?: string | null
          is_active?: boolean
          plan?: 'free' | 'starter' | 'pro' | 'enterprise'
          settings?: Json
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          owner_id?: string
          name?: string
          slug?: string
          custom_domain?: string | null
          tagline?: string | null
          logo_url?: string | null
          theme?: 'neon' | 'soft' | 'brutal'
          currency?: string
          currency_symbol?: string
          announcement?: string | null
          instagram_url?: string | null
          twitter_url?: string | null
          tiktok_url?: string | null
          google_sheet_id?: string | null
          google_sheet_last_sync?: string | null
          is_active?: boolean
          plan?: 'free' | 'starter' | 'pro' | 'enterprise'
          settings?: Json
        }
      }
      
      // Categories table
      categories: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          store_id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          sort_order: number
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          store_id: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          sort_order?: number
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          store_id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          sort_order?: number
          is_active?: boolean
        }
      }
      
      // Products table
      products: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          store_id: string
          external_id: string | null // ID from Google Sheets
          name: string
          slug: string
          description: string | null
          price: number
          compare_at_price: number | null
          images: string[] // Array of image URLs
          category_id: string | null
          tags: string[]
          in_stock: boolean
          stock_quantity: number | null
          variants: Json | null
          metadata: Json | null
          is_active: boolean
          sort_order: number
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          store_id: string
          external_id?: string | null
          name: string
          slug: string
          description?: string | null
          price: number
          compare_at_price?: number | null
          images?: string[]
          category_id?: string | null
          tags?: string[]
          in_stock?: boolean
          stock_quantity?: number | null
          variants?: Json | null
          metadata?: Json | null
          is_active?: boolean
          sort_order?: number
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          store_id?: string
          external_id?: string | null
          name?: string
          slug?: string
          description?: string | null
          price?: number
          compare_at_price?: number | null
          images?: string[]
          category_id?: string | null
          tags?: string[]
          in_stock?: boolean
          stock_quantity?: number | null
          variants?: Json | null
          metadata?: Json | null
          is_active?: boolean
          sort_order?: number
        }
      }
      
      // Orders table
      orders: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          store_id: string
          order_number: string
          status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          customer_email: string
          customer_name: string
          customer_phone: string | null
          shipping_address: Json
          billing_address: Json | null
          items: Json // Array of order items
          subtotal: number
          shipping_cost: number
          tax: number
          total: number
          currency: string
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
          payment_method: string | null
          payment_id: string | null
          notes: string | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          store_id: string
          order_number: string
          status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          shipping_address: Json
          billing_address?: Json | null
          items: Json
          subtotal: number
          shipping_cost?: number
          tax?: number
          total: number
          currency: string
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          payment_method?: string | null
          payment_id?: string | null
          notes?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          store_id?: string
          order_number?: string
          status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          shipping_address?: Json
          billing_address?: Json | null
          items?: Json
          subtotal?: number
          shipping_cost?: number
          tax?: number
          total?: number
          currency?: string
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          payment_method?: string | null
          payment_id?: string | null
          notes?: string | null
          metadata?: Json | null
        }
      }

      // Sync logs for Google Sheets
      sync_logs: {
        Row: {
          id: string
          created_at: string
          store_id: string
          status: 'pending' | 'running' | 'completed' | 'failed'
          products_synced: number
          categories_synced: number
          error_message: string | null
          duration_ms: number | null
        }
        Insert: {
          id?: string
          created_at?: string
          store_id: string
          status?: 'pending' | 'running' | 'completed' | 'failed'
          products_synced?: number
          categories_synced?: number
          error_message?: string | null
          duration_ms?: number | null
        }
        Update: {
          id?: string
          created_at?: string
          store_id?: string
          status?: 'pending' | 'running' | 'completed' | 'failed'
          products_synced?: number
          categories_synced?: number
          error_message?: string | null
          duration_ms?: number | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      store_theme: 'neon' | 'soft' | 'brutal'
      store_plan: 'free' | 'starter' | 'pro' | 'enterprise'
      order_status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
      payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
      sync_status: 'pending' | 'running' | 'completed' | 'failed'
    }
  }
}

// Helper types
export type Store = Database['public']['Tables']['stores']['Row']
export type StoreInsert = Database['public']['Tables']['stores']['Insert']
export type StoreUpdate = Database['public']['Tables']['stores']['Update']

export type Category = Database['public']['Tables']['categories']['Row']
export type CategoryInsert = Database['public']['Tables']['categories']['Insert']

export type Product = Database['public']['Tables']['products']['Row']
export type ProductInsert = Database['public']['Tables']['products']['Insert']

export type Order = Database['public']['Tables']['orders']['Row']
export type OrderInsert = Database['public']['Tables']['orders']['Insert']

export type SyncLog = Database['public']['Tables']['sync_logs']['Row']
