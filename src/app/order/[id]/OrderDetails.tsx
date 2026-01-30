'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Phone, Clock, Package } from 'lucide-react'
import { Order } from '@/lib/types'
import Link from 'next/link'
import Confetti from 'react-confetti'
import { useEffect, useState } from 'react'

interface OrderDetailsProps {
    order: Order
}

export default function OrderDetails({ order }: OrderDetailsProps) {
    const [showConfetti, setShowConfetti] = useState(true)
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

    useEffect(() => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight })
        const timer = setTimeout(() => setShowConfetti(false), 5000)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="min-h-screen bg-cream pt-24 pb-16 px-4 relative">
            {showConfetti && order.status === 'paid' && (
                <Confetti
                    width={windowSize.width}
                    height={windowSize.height}
                    recycle={false}
                    numberOfPieces={200}
                />
            )}

            <div className="max-w-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-2xl p-8 shadow-xl text-center"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                        <CheckCircle className="text-green-500" size={48} />
                    </motion.div>

                    <h1 className="text-3xl font-bold text-maroon font-serif mb-2">
                        Order Confirmed!
                    </h1>
                    <p className="text-gray-500 mb-6">
                        Thank you for your order. We&apos;re preparing your delicious shawarmas!
                    </p>

                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                        <p className="text-sm text-gray-500 mb-1">Order ID</p>
                        <p className="text-xl font-mono font-bold text-maroon">{order.id}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-orange/10 rounded-xl p-4">
                            <Clock className="text-orange mx-auto mb-2" size={24} />
                            <p className="text-sm text-gray-600">Status</p>
                            <p className="font-bold text-maroon capitalize">{order.status}</p>
                        </div>
                        <div className="bg-maroon/10 rounded-xl p-4">
                            <Package className="text-maroon mx-auto mb-2" size={24} />
                            <p className="text-sm text-gray-600">Total</p>
                            <p className="font-bold text-maroon">₹{order.total_amount}</p>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="text-left border-t pt-4 mb-6">
                        <h3 className="font-bold text-maroon mb-3">Your Order</h3>
                        {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                                <span className="text-gray-600">{item.name} × {item.qty}</span>
                                <span className="font-medium">₹{item.unit_price * item.qty}</span>
                            </div>
                        ))}
                    </div>

                    {/* Contact */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                        <p className="text-sm text-gray-500 mb-2">Questions about your order?</p>
                        <a
                            href="tel:+919080480773"
                            className="flex items-center justify-center gap-2 text-maroon font-bold hover:text-orange transition-colors"
                        >
                            <Phone size={18} />
                            +91 9080480773
                        </a>
                    </div>

                    <div className="flex gap-4">
                        <Link href="/track-order" className="flex-1">
                            <button className="w-full py-3 border-2 border-maroon text-maroon font-bold rounded-full hover:bg-maroon hover:text-white transition-colors">
                                Track Order
                            </button>
                        </Link>
                        <Link href="/" className="flex-1">
                            <button className="w-full py-3 bg-orange text-white font-bold rounded-full hover:bg-orange/90 transition-colors">
                                Order More
                            </button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
