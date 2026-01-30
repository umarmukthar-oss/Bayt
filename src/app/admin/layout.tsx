'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'
import AdminSidebar from './AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { isAdmin, loading, user } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && (!user || !isAdmin)) {
            router.push('/login?redirect=/admin')
        }
    }, [loading, user, isAdmin, router])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <Loader2 className="animate-spin text-maroon" size={40} />
            </div>
        )
    }

    if (!isAdmin) {
        return null
    }

    return (
        <div className="min-h-screen bg-gray-100 pt-16">
            <div className="flex">
                <AdminSidebar />
                <main className="flex-1 p-6 ml-64">{children}</main>
            </div>
        </div>
    )
}
