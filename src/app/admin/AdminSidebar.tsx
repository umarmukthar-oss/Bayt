'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, Tag, ShoppingBag, Home } from 'lucide-react'

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/inventory', label: 'Inventory', icon: Package },
    { href: '/admin/offers', label: 'Offers', icon: Tag },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
]

export default function AdminSidebar() {
    const pathname = usePathname()

    return (
        <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-6">
                <h2 className="text-lg font-bold text-maroon mb-6">Admin Dashboard</h2>
                <nav className="space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        const Icon = item.icon
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                        ? 'bg-maroon text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <Icon size={20} />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>

                <div className="mt-8 pt-8 border-t">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <Home size={20} />
                        Back to Store
                    </Link>
                </div>
            </div>
        </aside>
    )
}
