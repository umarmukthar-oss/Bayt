'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, Loader2, ArrowRight, Trash2, Phone } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions) => RazorpayInstance
    }
}

interface RazorpayOptions {
    key: string
    amount: number
    currency: string
    name: string
    description: string
    order_id: string
    handler: (response: RazorpayResponse) => void
    prefill: {
        contact: string
    }
    theme: {
        color: string
    }
}

interface RazorpayInstance {
    open: () => void
}

interface RazorpayResponse {
    razorpay_payment_id: string
    razorpay_order_id: string
    razorpay_signature: string
}

export default function CheckoutPage() {
    const { cart, items, removeItem, clearCart } = useCart()
    const { user, profile, loading: authLoading } = useAuth()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    useEffect(() => {
        // Load Razorpay script
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.async = true
        document.body.appendChild(script)
        return () => {
            document.body.removeChild(script)
        }
    }, [])

    const handlePayment = async () => {
        if (!user || !profile) {
            router.push('/login?redirect=/checkout')
            return
        }

        setLoading(true)
        setError('')

        try {
            // Create order
            const orderResponse = await fetch('/api/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: items.map((item) => ({
                        flavor_id: item.flavor.id,
                        name: item.flavor.name,
                        qty: item.qty,
                        unit_price: item.qty >= 2 ? item.flavor.price_double : item.flavor.price_single,
                    })),
                    subtotal: cart.subtotal,
                    discount: cart.discount,
                    total: cart.total,
                    offerApplied: cart.offerApplied,
                    phone: profile.phone,
                }),
            })

            const orderData = await orderResponse.json()

            if (!orderResponse.ok) {
                throw new Error(orderData.error || 'Failed to create order')
            }

            // MOCK PAYMENT FLOW
            // Instead of opening Razorpay, we simulate a successful payment immediately

            const verifyResponse = await fetch('/api/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    razorpay_payment_id: `pay_mock_${Date.now()}`,
                    razorpay_order_id: orderData.razorpay_order_id,
                    razorpay_signature: 'mock_signature',
                    order_id: orderData.order_id,
                }),
            })

            const verifyData = await verifyResponse.json()

            if (verifyResponse.ok) {
                clearCart()
                router.push(`/order/${orderData.order_id}`)
            } else {
                setError(verifyData.error || 'Payment verification failed')
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cream pt-16">
                <Loader2 className="animate-spin text-maroon" size={40} />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-cream pt-24 pb-16 px-4">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-3xl font-bold text-maroon font-serif mb-8 flex items-center gap-3">
                        <ShoppingBag size={32} />
                        Checkout
                    </h1>

                    {items.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 text-center">
                            <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
                            <h2 className="text-xl font-bold text-gray-600 mb-2">Your cart is empty</h2>
                            <p className="text-gray-500 mb-6">Add some delicious shawarmas to get started!</p>
                            <Link href="/#menu">
                                <button className="px-8 py-3 bg-orange text-white font-bold rounded-full">
                                    Browse Menu
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Cart Items */}
                            <div className="lg:col-span-2 space-y-4">
                                {items.map((item) => (
                                    <motion.div
                                        key={item.flavor.id}
                                        layout
                                        className="bg-white rounded-xl p-4 flex items-center gap-4"
                                    >
                                        <div className="w-20 h-20 bg-gradient-to-br from-orange/20 to-maroon/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <span className="text-4xl">🌯</span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-maroon">{item.flavor.name}</h3>
                                            <p className="text-sm text-gray-500">Quantity: {item.qty}</p>
                                            <p className="font-bold text-orange">
                                                ₹{item.qty >= 2
                                                    ? Math.floor(item.qty / 2) * item.flavor.price_double + (item.qty % 2) * item.flavor.price_single
                                                    : item.flavor.price_single
                                                }
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.flavor.id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-2xl p-6 sticky top-24">
                                    <h2 className="text-xl font-bold text-maroon mb-4">Order Summary</h2>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between text-gray-600">
                                            <span>Subtotal</span>
                                            <span>₹{cart.subtotal}</span>
                                        </div>
                                        {cart.discount > 0 && (
                                            <div className="flex justify-between text-green-600">
                                                <span>Discount</span>
                                                <span>-₹{cart.discount}</span>
                                            </div>
                                        )}
                                        <div className="border-t pt-3 flex justify-between text-xl font-bold text-maroon">
                                            <span>Total</span>
                                            <span>₹{cart.total}</span>
                                        </div>
                                    </div>

                                    {cart.offerApplied && (
                                        <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg mb-4 text-sm">
                                            🎉 {cart.offerApplied} applied!
                                        </div>
                                    )}

                                    {error && (
                                        <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">
                                            {error}
                                        </div>
                                    )}

                                    {!user ? (
                                        <Link href="/login?redirect=/checkout">
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="w-full py-4 bg-maroon text-white font-bold rounded-full flex items-center justify-center gap-2"
                                            >
                                                <Phone size={20} />
                                                Login to Continue
                                            </motion.button>
                                        </Link>
                                    ) : (
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handlePayment}
                                            disabled={loading}
                                            className="w-full py-4 bg-orange text-white font-bold rounded-full flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {loading ? (
                                                <Loader2 className="animate-spin" size={20} />
                                            ) : (
                                                <>
                                                    Pay ₹{cart.total}
                                                    <ArrowRight size={20} />
                                                </>
                                            )}
                                        </motion.button>
                                    )}

                                    <p className="text-xs text-gray-500 text-center mt-4">
                                        Secure payment (Mock Mode)
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    )
}
