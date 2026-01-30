'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import Link from 'next/link'

interface CartPanelProps {
    isOpen: boolean
    onClose: () => void
}

export default function CartPanel({ isOpen, onClose }: CartPanelProps) {
    const { cart, items, updateQuantity, removeItem, clearCart } = useCart()

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-50"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="text-maroon" size={24} />
                                <h2 className="text-xl font-bold text-maroon">Your Cart</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                    <ShoppingBag size={64} strokeWidth={1} />
                                    <p className="mt-4 text-lg">Your cart is empty</p>
                                    <Link href="/#menu" onClick={onClose}>
                                        <button className="mt-4 px-6 py-2 bg-orange text-white rounded-full font-medium hover:bg-orange/90 transition-colors">
                                            Browse Menu
                                        </button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <motion.div
                                            key={item.flavor.id}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -100 }}
                                            className="flex items-center gap-4 bg-gray-50 rounded-xl p-4"
                                        >
                                            {/* Image placeholder */}
                                            <div className="w-16 h-16 bg-gradient-to-br from-orange/20 to-maroon/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <span className="text-3xl">🌯</span>
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-maroon truncate">{item.flavor.name}</h3>
                                                <p className="text-sm text-gray-500">
                                                    ₹{item.qty >= 2
                                                        ? Math.floor(item.qty / 2) * item.flavor.price_double + (item.qty % 2) * item.flavor.price_single
                                                        : item.flavor.price_single
                                                    }
                                                </p>
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => updateQuantity(item.flavor.id, item.qty - 1)}
                                                    className="p-1 bg-white rounded-full shadow hover:bg-gray-50"
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span className="w-8 text-center font-bold">{item.qty}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.flavor.id, item.qty + 1)}
                                                    disabled={item.qty >= item.flavor.in_stock}
                                                    className="p-1 bg-white rounded-full shadow hover:bg-gray-50 disabled:opacity-50"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>

                                            {/* Remove */}
                                            <button
                                                onClick={() => removeItem(item.flavor.id)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </motion.div>
                                    ))}

                                    {/* Clear Cart */}
                                    <button
                                        onClick={clearCart}
                                        className="w-full py-2 text-red-500 hover:text-red-600 font-medium"
                                    >
                                        Clear Cart
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Footer - Summary & Checkout */}
                        {items.length > 0 && (
                            <div className="border-t p-6 space-y-4 bg-gray-50">
                                {/* Summary */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>₹{cart.subtotal}</span>
                                    </div>
                                    {cart.discount > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Discount ({cart.offerApplied})</span>
                                            <span>-₹{cart.discount}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-xl font-bold text-maroon pt-2 border-t">
                                        <span>Total</span>
                                        <span>₹{cart.total}</span>
                                    </div>
                                </div>

                                {/* Checkout Button */}
                                <Link href="/checkout" onClick={onClose}>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full py-4 bg-orange text-white font-bold rounded-full shadow-lg shadow-orange/30 hover:bg-orange/90 transition-all"
                                    >
                                        Proceed to Checkout
                                    </motion.button>
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
