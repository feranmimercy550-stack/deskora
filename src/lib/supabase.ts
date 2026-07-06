import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          business_name: string | null
          email: string | null
          currency: string | null
          country: string | null
          created_at: string | null
        }
        Insert: {
          id: string
          full_name?: string | null
          business_name?: string | null
          email?: string | null
          currency?: string | null
          country?: string | null
        }
      }
      customers: {
        Row: {
          id: string
          user_id: string
          full_name: string
          email: string | null
          phone: string | null
          business_name: string | null
          notes: string | null
          created_at: string | null
        }
        Insert: {
          user_id: string
          full_name: string
          email?: string | null
          phone?: string | null
          business_name?: string | null
          notes?: string | null
        }
      }
      invoices: {
        Row: {
          id: string
          user_id: string
          customer_id: string | null
          amount: number
          status: string | null
          due_date: string | null
          description: string | null
          created_at: string | null
        }
        Insert: {
          user_id: string
          customer_id?: string | null
          amount: number
          status?: string | null
          due_date?: string | null
          description?: string | null
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string
          invoice_id: string | null
          amount: number
          paid_at: string | null
        }
        Insert: {
          user_id: string
          invoice_id?: string | null
          amount: number
        }
      }
    }
  }
}

const globalForSupabase = globalThis as unknown as {
  supabase: ReturnType<typeof createClient<Database>> | undefined
}

export const supabase =
  globalForSupabase.supabase ??
  createClient<Database>(supabaseUrl, supabaseAnonKey)

if (process.env.NODE_ENV !== 'production') {
  globalForSupabase.supabase = supabase
}