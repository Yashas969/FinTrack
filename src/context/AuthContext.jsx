import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session?.user) {
                fetchProfile(session.user);
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session?.user) {
                fetchProfile(session.user);
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (authUser) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', authUser.id)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 means "no rows found"
                console.error('Error fetching profile:', error);
            }

            if (data) {
                setUser({
                    ...authUser,
                    ...data,
                    profilePicture: data.profile_picture // Map DB snake_case to app camelCase
                });
            } else {
                // If no profile exists yet, just use auth data
                // We might want to create one here if strict
                const newProfile = {
                    id: authUser.id,
                    name: authUser.email.split('@')[0],
                    email: authUser.email,
                    dob: null,
                    gender: 'Not Specified',
                    profile_picture: null
                };

                // Attempt to Create if missing (optional self-repair)
                const { error: insertError } = await supabase.from('profiles').insert([newProfile]);

                if (!insertError) {
                    setUser({ ...authUser, ...newProfile, profilePicture: null });
                } else {
                    setUser(authUser); // Fallback to just auth user if profile creation fails
                }
            }
        } catch (err) {
            console.error(err);
            setUser(authUser); // Fallback to just auth user on error
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) throw error;
        return data;
    };

    const signUp = async (email, password, profileDetails = {}) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });

        if (error) throw error;

        if (data?.user) {
            // Create profile immediately
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([
                    {
                        id: data.user.id,
                        email: email,
                        name: profileDetails.name || email.split('@')[0],
                        dob: profileDetails.dob || null,
                        gender: profileDetails.gender || 'Not Specified',
                        profile_picture: null
                    }
                ]);
            if (profileError) {
                console.error('Error creating profile:', profileError);
                // Optional: throw error or handle it. Prompt says "If profile insert fails: Show error".
                // But this function returns data. I should probably throw to let the UI know.
                throw new Error("Account created but profile setup failed: " + profileError.message);
            }
        }

        return data;
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.error('Error signing out:', error);
        setUser(null);
        setSession(null);
    };

    const updateProfile = async (updatedData) => {
        if (!user) return;

        // DB updates use snake_case
        const dbUpdates = {
            name: updatedData.name,
            dob: updatedData.dob,
            gender: updatedData.gender,
            profile_picture: updatedData.profilePicture || updatedData.profile_picture,
            updated_at: new Date()
        };

        const { data, error } = await supabase
            .from('profiles')
            .update(dbUpdates)
            .eq('id', user.id)
            .select()
            .single();

        if (error) {
            console.error('Error updating profile:', error);
            throw error;
        }

        if (data) {
            // Local updates use camelCase
            // Create a new user object to ensure state change triggers re-renders
            const newUser = {
                ...user,
                ...data, // This will apply snake_case fields
                profilePicture: data.profile_picture // Explicitly map snake_case to camelCase
            };
            setUser(newUser);
        }
    };

    const value = {
        user,
        session,
        isAuthenticated: !!session,
        login,
        signUp,
        logout,
        updateProfile,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
