'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { ShoppingBag, DollarSign, AlertTriangle, TrendingUp } from 'lucide-react'
import { Order, Flavor } from '@/lib/types'

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        todayOrders: 0,
        todayRevenue: 0,
        lowStockItems: 0,
        totalOrders: 0,
    })
    const [recentOrders, setRecentOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchData = async () => {
            const today = new Date()
            today.setHours(0, 0, 0, 0)

            // Fetch today's orders
            const { data: todayOrdersData } = await supabase
                .from('orders')
                .select('*')
                .gte('created_at', today.toISOString())
                .neq('status', 'cancelled')

            // Fetch low stock items
            const { data: lowStockData } = await supabase
                .from('flavors')
                .select('*')
                .lte('in_stock', 5)

            // Fetch recent orders
            const { data: recentOrdersData } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5)

            // Fetch total orders count
            const { count: totalCount } = await supabase
                .from('orders')
                .select('*', { count: 'exact', head: true })
                .neq('status', 'cancelled')

            const todayOrders = todayOrdersData || []
            const todayRevenue = todayOrders
                .filter((o) => o.status !== 'pending')
                .reduce((sum, o) => sum + o.total_amount, 0)

            setStats({
                todayOrders: todayOrders.length,
                todayRevenue,
                lowStockItems: (lowStockData as Flavor[])?.length || 0,
                totalOrders: totalCount || 0,
            })
            setRecentOrders((recentOrdersData as Order[]) || [])
            setLoading(false)
        }

        fetchData()

        // Subscribe to realtime updates
        const channel = supabase
            .channel('orders')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'orders' },
                () => {
                    fetchData()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const statCards = [
        {
            label: "Today's Orders",
            value: stats.todayOrders,
            icon: ShoppingBag,
            color: 'bg-blue-500',
        },
        {
            label: "Today's Revenue",
            value: `₹${stats.todayRevenue}`,
            icon: DollarSign,
            color: 'bg-green-500',
        },
        {
            label: 'Low Stock Alerts',
            value: stats.lowStockItems,
            icon: AlertTriangle,
            color: 'bg-yellow-500',
        },
        {
            label: 'Total Orders',
            value: stats.totalOrders,
            icon: TrendingUp,
            color: 'bg-purple-500',
        },
    ]

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid':
                return 'bg-blue-100 text-blue-700'
            case 'preparing':
                return 'bg-yellow-100 text-yellow-700'
            case 'ready':
                return 'bg-green-100 text-green-700'
            case 'delivered':
                return 'bg-gray-100 text-gray-700'
            case 'cancelled':
                return 'bg-red-100 text-red-700'
            default:
                return 'bg-orange/20 text-orange'
        }
    }

    if (loading) {
        return (
            <div className="animate-pulse space-y-6">
                <div className="grid grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-32 bg-gray-200 rounded-xl" />
                    ))}
                </div>
                <div className="h-96 bg-gray-200 rounded-xl" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-maroon">Dashboard Overview</h1>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl p-6 shadow-sm"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                                    <Icon size={24} />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b">
                    <h2 className="text-lg font-bold text-maroon">Recent Orders</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {recentOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-mono text-sm">{order.id.slice(0, 8)}</td>
                                    <td className="px-6 py-4 text-sm">{order.phone}</td>
                                    <td className="px-6 py-4 text-sm">
                                        {order.items.map((i) => `${i.name} x${i.qty}`).join(', ')}
                                    </td>
                                    <td className="px-6 py-4 font-medium">₹{order.total_amount}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(order.created_at).toLocaleTimeString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
