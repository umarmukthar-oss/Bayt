'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User as SupabaseUser, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { User } from '@/lib/types'

interface AuthContextType {
    user: SupabaseUser | null
    profile: User | null
    session: Session | null
    loading: boolean
    signInWithOtp: (phone: string) => Promise<{ error: Error | null }>
    verifyOtp: (phone: string, token: string) => Promise<{ error: Error | null }>
    signOut: () => Promise<void>
    isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<SupabaseUser | null>(null)
    const [profile, setProfile] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)

    const supabase = createClient()

    useEffect(() => {
        // Get initial session
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setSession(session)
            setUser(session?.user ?? null)

            if (session?.user) {
                await fetchProfile(session.user.id)
            }
            setLoading(false)
        }

        getSession()

        // Listen to auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setSession(session)
                setUser(session?.user ?? null)

                if (session?.user) {
                    await fetchProfile(session.user.id)
                } else {
                    setProfile(null)
                }
                setLoading(false)
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    const fetchProfile = async (userId: string) => {
        const { data } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single()

        setProfile(data as User | null)
    }

    const signInWithOtp = async (phone: string) => {
        const { error } = await supabase.auth.signInWithOtp({
            phone: phone.startsWith('+91') ? phone : `+91${phone}`,
        })
        return { error }
    }

    const verifyOtp = async (phone: string, token: string) => {
        const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone}`
        const { error } = await supabase.auth.verifyOtp({
            phone: formattedPhone,
            token,
            type: 'sms',
        })

        if (!error) {
            // Create user profile if it doesn't exist
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data: existingProfile } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', user.id)
                    .single()

                if (!existingProfile) {
                    await supabase.from('users').insert({
                        id: user.id,
                        phone: formattedPhone,
                        role: 'customer',
                    })
                }
            }
        }

        return { error }
    }

    const signOut = async () => {
        await supabase.auth.signOut()
        setUser(null)
        setProfile(null)
        setSession(null)
    }

    const isAdmin = profile?.role === 'admin'

    return (
        <AuthContext.Provider
            value={{
                user,
                profile,
                session,
                loading,
                signInWithOtp,
                verifyOtp,
                signOut,
                isAdmin,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
