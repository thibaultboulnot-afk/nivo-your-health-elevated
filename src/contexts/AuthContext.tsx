import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
        
        // If user just signed in, check for pending diagnostic in localStorage
        if (event === 'SIGNED_IN' && session?.user) {
          setTimeout(() => {
            savePendingDiagnostic(session.user.id);
          }, 0);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, session, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Save pending diagnostic from localStorage to Supabase
async function savePendingDiagnostic(userId: string) {
  const pendingDiagnostic = localStorage.getItem('pending_diagnostic');
  if (!pendingDiagnostic) return;

  try {
    const { healthScore, answers } = JSON.parse(pendingDiagnostic);
    
    const { error } = await supabase
      .from('user_diagnostics')
      .insert({
        user_id: userId,
        health_score: healthScore,
        answers: answers,
      });

    if (!error) {
      localStorage.removeItem('pending_diagnostic');
    }
  } catch (e) {
    console.error('Failed to save pending diagnostic:', e);
  }
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
