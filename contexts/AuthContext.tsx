import { Session, User } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSupabase } from '../lib/supabase';
import { Profile } from '../types/supabase';

// Get lazy supabase instance
const supabase = {
  get auth() {
    return getSupabase().auth;
  },
  from(table: string) {
    return getSupabase().from(table);
  },
};

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from database
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      return data as Profile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  // Refresh profile data
  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, name?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || email.split('@')[0],
          },
        },
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  // Sign out
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        
        if (initialSession?.user) {
          const profileData = await fetchProfile(initialSession.user.id);
          setProfile(profileData);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event);
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          // Small delay to allow trigger to create profile
          setTimeout(async () => {
            const profileData = await fetchProfile(currentSession.user.id);
            setProfile(profileData);
          }, 500);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
