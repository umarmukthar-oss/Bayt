'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-cream via-white to-orange/10 pt-16 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%237B2D26' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center lg:text-left"
                    >
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-block px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-full mb-6"
                        >
                            100% Halal Certified
                        </motion.span>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-maroon font-serif leading-tight mb-6"
                        >
                            Fresh, Juicy &{' '}
                            <span className="text-orange italic">Authentic</span>{' '}
                            Shawarmas
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-lg text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0"
                        >
                            Experience the taste of authentic Middle Eastern shawarmas,
                            prepared with love and delivered fresh to your doorstep.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                        >
                            <Link href="/#menu">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-4 bg-orange text-white font-bold rounded-full shadow-lg shadow-orange/30 hover:bg-orange/90 transition-all relative overflow-hidden group"
                                >
                                    <span className="relative z-10">Order Now</span>
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-orange via-yellow-500 to-orange"
                                        animate={{
                                            x: ['0%', '100%', '0%'],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: 'linear',
                                        }}
                                        style={{ opacity: 0.3 }}
                                    />
                                </motion.button>
                            </Link>
                            <Link href="/track-order">
                                <button className="px-8 py-4 border-2 border-maroon text-maroon font-bold rounded-full hover:bg-maroon hover:text-white transition-all">
                                    Track Order
                                </button>
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Image */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="relative w-full aspect-square max-w-md mx-auto">
                            {/* Decorative circles */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                className="absolute inset-0 border-4 border-dashed border-orange/30 rounded-full"
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                                className="absolute inset-8 border-4 border-dashed border-maroon/20 rounded-full"
                            />

                            {/* Main image container */}
                            <div className="absolute inset-16 bg-gradient-to-br from-orange to-maroon rounded-full shadow-2xl flex items-center justify-center overflow-hidden">
                                <span className="text-6xl">🌯</span>
                            </div>

                            {/* Floating badges */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute top-4 right-4 bg-white px-4 py-2 rounded-full shadow-lg"
                            >
                                <span className="text-maroon font-bold">Starting ₹70</span>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                className="absolute bottom-4 left-4 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg"
                            >
                                <span className="font-bold">🔥 Hot & Fresh</span>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
                <div className="w-6 h-10 border-2 border-maroon/30 rounded-full flex justify-center">
                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-1.5 h-3 bg-maroon/50 rounded-full mt-2"
                    />
                </div>
            </motion.div>
        </section>
    )
}
