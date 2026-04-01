export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  ward: string;
  role: 'delegate' | 'admin' | 'subscriber';
  status: 'pending' | 'approved' | 'rejected';
  created_at: string; // Supabase uses snake_case
}

export interface Post {
  id: string;
  user_id: string;        // Supabase uses snake_case for foreign keys
  user_name: string;     // Supabase uses snake_case
  content: string;
  media_url?: string;      // Supabase uses snake_case
  media_type?: 'image' | 'video';
  emoji?: string;
  created_at: string;      // Supabase uses snake_case
  likes: number;
}

export interface Subscriber {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  subscribed_at: string;    // Supabase uses snake_case
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  phone: string;
  ward: string;
  password: string;
  interest: 'delegate' | 'volunteer' | 'updates';
}

// Updated AuthState with admin flag
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
}

// New: Supabase-specific types
export interface DatabaseUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  ward: string;
  role: 'delegate' | 'admin' | 'subscriber';
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  ward?: string;
  role: 'admin' | 'delegate' | 'subscriber';
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  approved_at?: string;
  approved_by?: string;
}

export interface Subscriber {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  subscribed_at: string;
  status?: 'active' | 'unsubscribed';
}

export interface Post {
  id: string;
  title?: string;
  content: string;
  featured_image?: string;
  author_id: string;
  author?: {
    name: string;
    email: string;
  };
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  likes?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  ward?: string;
  interest?: 'delegate' | 'subscriber' | 'partner';
}

// Helper type for Supabase query responses
export type SupabaseUserResponse = DatabaseUser | null;