
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      todos: {
        Row: {
          id: string
          text: string
          completed: boolean
          type: 'pomodoro' | 'backlog'
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          text: string
          completed?: boolean
          type: 'pomodoro' | 'backlog'
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          text?: string
          completed?: boolean
          type?: 'pomodoro' | 'backlog'
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
