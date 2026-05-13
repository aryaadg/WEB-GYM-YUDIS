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
      profiles: {
        Row: {
          id: string
          role: 'admin' | 'member'
          full_name: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          role?: 'admin' | 'member'
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          role?: 'admin' | 'member'
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
      }
      coaches: {
        Row: {
          id: string
          name: string
          photo_url: string | null
          specialization: string | null
          bio: string | null
          instagram: string | null
          email: string | null
          phone: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          photo_url?: string | null
          specialization?: string | null
          bio?: string | null
          instagram?: string | null
          email?: string | null
          phone?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          photo_url?: string | null
          specialization?: string | null
          bio?: string | null
          instagram?: string | null
          email?: string | null
          phone?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      articles: {
        Row: {
          id: string
          title: string
          slug: string
          content: string | null
          featured_image: string | null
          author_id: string | null
          category: string | null
          tags: string[] | null
          status: 'draft' | 'published'
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content?: string | null
          featured_image?: string | null
          author_id?: string | null
          category?: string | null
          tags?: string[] | null
          status?: 'draft' | 'published'
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string | null
          featured_image?: string | null
          author_id?: string | null
          category?: string | null
          tags?: string[] | null
          status?: 'draft' | 'published'
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      members: {
        Row: {
          id: string
          user_id: string | null
          full_name: string
          email: string
          phone: string | null
          address: string | null
          photo_url: string | null
          membership_type: 'monthly' | 'yearly' | 'day_pass' | 'personal_training' | null
          start_date: string | null
          end_date: string | null
          payment_status: 'paid' | 'pending' | 'expired'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          full_name: string
          email: string
          phone?: string | null
          address?: string | null
          photo_url?: string | null
          membership_type?: 'monthly' | 'yearly' | 'day_pass' | 'personal_training' | null
          start_date?: string | null
          end_date?: string | null
          payment_status?: 'paid' | 'pending' | 'expired'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          full_name?: string
          email?: string
          phone?: string | null
          address?: string | null
          photo_url?: string | null
          membership_type?: 'monthly' | 'yearly' | 'day_pass' | 'personal_training' | null
          start_date?: string | null
          end_date?: string | null
          payment_status?: 'paid' | 'pending' | 'expired'
          created_at?: string
          updated_at?: string
        }
      }
      classes: {
        Row: {
          id: string
          name: string
          description: string | null
          coach_id: string | null
          day_of_week: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday' | null
          start_time: string
          duration_minutes: number
          max_capacity: number
          class_type: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          coach_id?: string | null
          day_of_week?: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday' | null
          start_time: string
          duration_minutes: number
          max_capacity?: number
          class_type?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          coach_id?: string | null
          day_of_week?: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday' | null
          start_time?: string
          duration_minutes?: number
          max_capacity?: number
          class_type?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}