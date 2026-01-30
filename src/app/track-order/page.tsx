'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Package, Phone, Clock, CheckCircle, Loader2, XCircle, ChefHat, Truck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Order } from '@/lib/types'

const statusSteps = [
    { key: 'paid', label: 'Order Confirmed', icon: CheckCircle },
    { key: 'preparing', label: 'Preparing', icon: ChefHat },
    { key: 'ready', label: 'Ready', icon: Package },
    { key: 'delivered', label: 'Delivered', icon: Truck },
]

export default function TrackOrderPage() {
    const [orderId, setOrderId] = useState('')
    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const supabase = createClient()

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!orderId.trim()) return

        setLoading(true)
        setError('')
        setOrder(null)

        const { data, error: fetchError } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId.trim())
            .single()

        if (fetchError || !data) {
            setError('Order not found. Please check the order ID.')
        } else {
            setOrder(data as Order)
        }

        setLoading(false)
    }

    const getStatusIndex = (status: string) => {
        if (status === 'pending') return -1
        if (status === 'cancelled') return -2
        return statusSteps.findIndex((s) => s.key === status)
    }

    return (
        <div className="min-h-screen bg-cream pt-24 pb-16 px-4">
            <div className="max-w-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="text-center mb-8">
                        <Package className="mx-auto text-maroon mb-4" size={48} />
                        <h1 className="text-3xl font-bold text-maroon font-serif mb-2">
                            Track Your Order
                        </h1>
                        <p className="text-gray-500">
                            Enter your order ID to check the status
                        </p>
                    </div>

                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="mb-8">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                placeholder="Enter Order ID"
                                className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange focus:border-orange outline-none"
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                disabled={loading}
                                className="px-6 py-3 bg-orange text-white font-bold rounded-xl flex items-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
                            </motion.button>
                        </div>
                    </form>

                    {error && (
                        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6 text-center">
                            {error}
                        </div>
                    )}

                    {/* Order Details */}
                    {order && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl p-6 shadow-lg"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-maroon">Order #{order.id.slice(0, 8)}</h2>
                                    <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                                        <Clock size={14} />
                                        {new Date(order.created_at).toLocaleString()}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-orange/20 text-orange'
                                    }`}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                            </div>

                            {/* Status Timeline */}
                            {order.status !== 'pending' && order.status !== 'cancelled' && (
                                <div className="mb-6">
                                    <div className="flex justify-between items-center">
                                        {statusSteps.map((step, index) => {
                                            const currentIndex = getStatusIndex(order.status)
                                            const isCompleted = index <= currentIndex
                                            const isCurrent = index === currentIndex
                                            const Icon = step.icon

                                            return (
                                                <div key={step.key} className="flex flex-col items-center flex-1">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                                                        } ${isCurrent ? 'ring-4 ring-green-200' : ''}`}>
                                                        <Icon size={20} />
                                                    </div>
                                                    <span className={`text-xs mt-2 text-center ${isCompleted ? 'text-green-600 font-medium' : 'text-gray-400'
                                                        }`}>
                                                        {step.label}
                                                    </span>
                                                    {index < statusSteps.length - 1 && (
                                                        <div className={`absolute h-1 w-[calc(25%-2.5rem)] top-5 left-[calc(${(index + 1) * 25}%-0.5rem)] ${index < currentIndex ? 'bg-green-500' : 'bg-gray-200'
                                                            }`} />
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {order.status === 'cancelled' && (
                                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
                                    <XCircle size={20} />
                                    This order has been cancelled.
                                </div>
                            )}

                            {/* Order Items */}
                            <div className="border-t pt-4 mb-4">
                                <h3 className="font-bold text-maroon mb-3">Items</h3>
                                <div className="space-y-2">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex justify-between text-gray-600">
                                            <span>{item.name} × {item.qty}</span>
                                            <span>₹{item.unit_price * item.qty}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Total */}
                            <div className="border-t pt-4 flex justify-between text-lg font-bold text-maroon">
                                <span>Total</span>
                                <span>₹{order.total_amount}</span>
                            </div>

                            {/* Contact */}
                            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                                <p className="text-gray-600 text-sm mb-2">Need help with your order?</p>
                                <a
                                    href="tel:+919080480773"
                                    className="flex items-center gap-2 text-maroon font-medium hover:text-orange transition-colors"
                                >
                                    <Phone size={18} />
                                    +91 9080480773
                                </a>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    )
}
