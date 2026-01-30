'use client'

import Link from 'next/link'
import { ShoppingCart, Menu, X, User } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { itemCount } = useCart()
    const { user, isAdmin, signOut } = useAuth()

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-maroon font-serif">
                            Bayt Shawarma&apos;s
                        </span>
                        <span className="px-2 py-0.5 text-xs font-bold text-white bg-green-600 rounded-full">
                            Halal
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/#menu" className="text-gray-700 hover:text-maroon font-medium transition-colors">
                            Menu
                        </Link>
                        <Link href="/track-order" className="text-gray-700 hover:text-maroon font-medium transition-colors">
                            Track Order
                        </Link>
                        {user ? (
                            <div className="flex items-center gap-4">
                                {isAdmin && (
                                    <Link href="/admin" className="text-gray-700 hover:text-maroon font-medium transition-colors">
                                        Dashboard
                                    </Link>
                                )}
                                <button
                                    onClick={() => signOut()}
                                    className="text-gray-700 hover:text-maroon font-medium transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link href="/login" className="text-gray-700 hover:text-maroon font-medium transition-colors flex items-center gap-1">
                                <User size={18} />
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Cart & Mobile Menu Toggle */}
                    <div className="flex items-center gap-4">
                        <Link href="/checkout" className="relative p-2 text-gray-700 hover:text-maroon transition-colors">
                            <ShoppingCart size={24} />
                            {itemCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 w-5 h-5 bg-orange text-white text-xs font-bold rounded-full flex items-center justify-center"
                                >
                                    {itemCount}
                                </motion.span>
                            )}
                        </Link>

                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-gray-700"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-gray-100"
                    >
                        <div className="px-4 py-4 space-y-3">
                            <Link
                                href="/#menu"
                                className="block text-gray-700 hover:text-maroon font-medium py-2"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Menu
                            </Link>
                            <Link
                                href="/track-order"
                                className="block text-gray-700 hover:text-maroon font-medium py-2"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Track Order
                            </Link>
                            {user ? (
                                <>
                                    {isAdmin && (
                                        <Link
                                            href="/admin"
                                            className="block text-gray-700 hover:text-maroon font-medium py-2"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Dashboard
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => {
                                            signOut()
                                            setMobileMenuOpen(false)
                                        }}
                                        className="block text-gray-700 hover:text-maroon font-medium py-2 w-full text-left"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    className="block text-gray-700 hover:text-maroon font-medium py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}
