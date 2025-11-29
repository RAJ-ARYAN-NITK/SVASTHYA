import React from 'react';
import { useStorageState } from '@/useStorageState';
import { login, syncUser } from './services/api';
import { useAuth, useUser } from '@clerk/clerk-expo';

const AuthContext = React.createContext<{
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => void;
    session?: string | null;
    isLoading: boolean;
}>({
    signIn: async () => { },
    signOut: () => null,
    session: null,
    isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
    const value = React.useContext(AuthContext);
    if (process.env.NODE_ENV !== 'production') {
        if (!value) {
            throw new Error('useSession must be wrapped in a <SessionProvider />');
        }
    }
    return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
    const [[isLoading, session], setSession] = useStorageState('session');
    const { getToken, signOut: clerkSignOut, userId } = useAuth();
    const { user } = useUser();

    // Sync Clerk session with local session if needed, or just expose Clerk's state
    // For now, we return the local session OR the Clerk session ID if available
    const activeSession = session || userId;

    React.useEffect(() => {
        if (user && userId) {
            const email = user.primaryEmailAddress?.emailAddress;
            const name = user.fullName || user.firstName || 'User';

            if (email) {
                syncUser({ name, email, googleId: userId })
                    .then((data) => {
                        console.log('User synced with backend:', data);
                        // Optionally store the backend token if needed
                        // setSession(data.token); 
                    })
                    .catch((err) => {
                        console.error('Failed to sync user:', err);
                    });
            }
        }
    }, [user, userId]);

    return (
        <AuthContext.Provider
            value={{
                signIn: async (email, password) => {
                    try {
                        const data = await login({ email, password });
                        setSession(data.token);
                    } catch (error) {
                        console.error('Login failed:', error);
                        throw error;
                    }
                },
                signOut: () => {
                    setSession(null);
                    clerkSignOut();
                },
                session: activeSession,
                isLoading,
            }}>
            {props.children}
        </AuthContext.Provider>
    );
}
