import React, { createContext, useContext, useEffect, useCallback } from 'react';
import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-expo';
import { setTokenGetter } from '../lib/api';

interface User {
  id: string;
  email: string;
  displayName: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, getToken, signOut } = useClerkAuth();
  const { user: clerkUser } = useUser();

  // Wire Clerk's getToken into the API client
  useEffect(() => {
    setTokenGetter(getToken);
  }, [getToken]);

  const user: User | null =
    isLoaded && isSignedIn && clerkUser
      ? {
          id: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress || '',
          displayName: clerkUser.fullName || clerkUser.firstName || '',
        }
      : null;

  const logout = useCallback(async () => {
    await signOut();
  }, [signOut]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: !isLoaded,
        isAuthenticated: !!isSignedIn,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
