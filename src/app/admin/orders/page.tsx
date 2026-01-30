'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { ShoppingBag, Download, ChevronDown } from 'lucide-react'
import { Order, OrderStatus } from '@/lib/types'

const statusOptions: OrderStatus[] = ['pending', 'paid', 'preparing', 'ready', 'delivered', 'cancelled']

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<string>('all')
    const supabase = createClient()

    const fetchOrders = async () => {
        let query = supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false })

        if (filter !== 'all') {
            query = query.eq('status', filter)
        }

        const { data } = await query
        setOrders((data as Order[]) || [])
        setLoading(false)
    }

    useEffect(() => {
        fetchOrders()

        // Subscribe to realtime updates
        const channel = supabase
            .channel('admin-orders')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'orders' },
                () => {
                    fetchOrders()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [filter])

    const updateStatus = async (orderId: string, newStatus: OrderStatus) => {
        const { error } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', orderId)

        if (!error) {
            setOrders((prev) =>
                prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
            )
        }
    }

    const exportCSV = () => {
        const headers = ['Order ID', 'Phone', 'Items', 'Total', 'Status', 'Date']
        const rows = orders.map((o) => [
            o.id,
            o.phone,
            o.items.map((i) => `${i.name} x${i.qty}`).join('; '),
            o.total_amount,
            o.status,
            new Date(o.created_at).toLocaleString(),
        ])

        const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
    }

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
            <div className="animate-pulse space-y-4">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-200 rounded-xl" />
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-maroon flex items-center gap-2">
                    <ShoppingBag size={28} />
                    Orders
                </h1>
                <div className="flex items-center gap-4">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2 border rounded-lg bg-white"
                    >
                        <option value="all">All Orders</option>
                        {statusOptions.map((status) => (
                            <option key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={exportCSV}
                        className="flex items-center gap-2 px-4 py-2 bg-maroon text-white rounded-lg hover:bg-maroon/90"
                    >
                        <Download size={20} />
                        Export CSV
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    No orders found
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <motion.tr
                                    key={order.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4 font-mono text-sm">{order.id.slice(0, 8)}</td>
                                    <td className="px-6 py-4 text-sm">{order.phone}</td>
                                    <td className="px-6 py-4 text-sm">
                                        {order.items.map((i) => `${i.name} x${i.qty}`).join(', ')}
                                    </td>
                                    <td className="px-6 py-4 font-medium">₹{order.total_amount}</td>
                                    <td className="px-6 py-4">
                                        <div className="relative inline-block">
                                            <select
                                                value={order.status}
                                                onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                                                className={`appearance-none px-3 py-1 pr-8 rounded-full text-sm font-medium cursor-pointer ${getStatusColor(order.status)}`}
                                            >
                                                {statusOptions.map((status) => (
                                                    <option key={status} value={status}>
                                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(order.created_at).toLocaleString()}
                                    </td>
                                </motion.tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
