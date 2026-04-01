import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, LoginCredentials, SignupData } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isDelegate: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; role?: string }>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => Promise<void>;
  approveUser: (userId: string) => Promise<void>;
  rejectUser: (userId: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUserProfile = useCallback(async (authUserId: string): Promise<{ success: boolean; role?: string }> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUserId)
        .maybeSingle();

      if (error) {
        console.error('Error loading profile:', error.message);
        setUser(null);
        return { success: false };
      }

      if (!data) {
        console.log('Profile not found for:', authUserId);
        setUser(null);
        return { success: false };
      }

      setUser(data as User);
      return { success: true, role: data.role };
    } catch (error) {
      console.error('Exception:', error);
      setUser(null);
      return { success: false };
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        await loadUserProfile(session.user.id);
      }
      setIsLoading(false);
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth event:', event);
        
        if (session?.user) {
          setTimeout(() => {
            loadUserProfile(session.user.id).then(() => setIsLoading(false));
          }, 0);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [loadUserProfile]);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error || !data.user) {
        console.error('Login error:', error?.message);
        return { success: false };
      }

      const result = await loadUserProfile(data.user.id);
      setIsLoading(false);
      
      return result;
    } catch (error) {
      console.error('Login exception:', error);
      setIsLoading(false);
      return { success: false };
    }
  };

  const signup = async (data: SignupData) => {
    setIsLoading(true);
    
    try {
      const role = data.interest === 'delegate' ? 'delegate' : 'subscriber';
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            phone: data.phone,
            ward: data.ward,
            role: role,
            interest: data.interest,
          }
        }
      });

      if (authError || !authData.user) {
        console.error('Signup error:', authError?.message);
        return false;
      }

      if (data.interest === 'delegate') {
        await supabase.auth.signOut();
        setUser(null);
      }

      return true;
    } catch (error) {
      console.error('Signup exception:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setIsLoading(false);
  };

  const approveUser = async (userId: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ 
        status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by: user?.id
      })
      .eq('id', userId);

    if (error) {
      console.error('Approve error:', error.message);
      throw new Error(`Failed to approve: ${error.message}`);
    }
  };

  const rejectUser = async (userId: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ 
        status: 'rejected',
        approved_at: new Date().toISOString(),
        approved_by: user?.id
      })
      .eq('id', userId);

    if (error) {
      console.error('Reject error:', error.message);
      throw new Error(`Failed to reject: ${error.message}`);
    }
  };

  const deleteUser = async (userId: string) => {
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (profileError) {
      console.error('Delete profile error:', profileError.message);
      throw new Error(`Failed to delete user profile: ${profileError.message}`);
    }
  };

  const refreshUser = async () => {
    if (user?.id) {
      setIsLoading(true);
      await loadUserProfile(user.id);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      isAdmin: user?.role === 'admin',
      isDelegate: user?.role === 'delegate',
      login,
      signup,
      logout,
      approveUser,
      rejectUser,
      deleteUser,
      refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}