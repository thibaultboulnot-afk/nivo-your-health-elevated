// Placeholder Supabase client until Cloud is enabled
// This will be replaced when Lovable Cloud is connected

export const supabase = {
  from: (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: unknown) => ({
        maybeSingle: async () => ({
          data: {
            id: 'demo-user-123',
            email: 'utilisateur@nivo.app',
            first_name: 'Thomas',
            last_name: 'Martin',
            full_name: 'Thomas Martin',
            current_day: 3,
            pain_zone: 'lombaires',
            screen_hours: 8,
            subscription_status: 'active',
          },
          error: null,
        }),
        single: async () => ({
          data: null,
          error: null,
        }),
      }),
    }),
    upsert: async (data: unknown) => ({
      data: null,
      error: null,
    }),
  }),
  auth: {
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => ({
      data: null,
      error: null,
    }),
    signOut: async () => ({ error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: (callback: (event: string, session: unknown) => void) => ({
      data: { subscription: { unsubscribe: () => {} } },
    }),
  },
};
