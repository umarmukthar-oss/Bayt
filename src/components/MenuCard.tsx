'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Minus, ShoppingCart } from 'lucide-react'
import { Flavor } from '@/lib/types'
import { useCart } from '@/contexts/CartContext'
import Image from 'next/image'

interface MenuCardProps {
    flavor: Flavor
    index: number
}

export default function MenuCard({ flavor, index }: MenuCardProps) {
    const [qty, setQty] = useState(1)
    const { addItem } = useCart()
    const isOutOfStock = flavor.in_stock === 0
    const isLowStock = flavor.in_stock > 0 && flavor.in_stock <= 5

    const handleAddToCart = () => {
        if (!isOutOfStock) {
            addItem(flavor, qty)
            setQty(1)
        }
    }

    const getStockBadge = () => {
        if (isOutOfStock) {
            return <span className="px-3 py-1 bg-red-100 text-red-600 text-sm font-medium rounded-full">Out of Stock</span>
        }
        if (isLowStock) {
            return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full">Only {flavor.in_stock} left</span>
        }
        return <span className="px-3 py-1 bg-green-100 text-green-600 text-sm font-medium rounded-full">In Stock</span>
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className={`bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${isOutOfStock ? 'opacity-70' : ''
                }`}
        >
            {/* Image */}
            <div className="relative h-48 bg-gradient-to-br from-orange/20 to-maroon/10 flex items-center justify-center">
                {flavor.image_url ? (
                    <Image
                        src={flavor.image_url}
                        alt={flavor.name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <span className="text-6xl">🌯</span>
                )}

                {/* Halal Badge */}
                <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-green-600 text-white text-xs font-bold rounded-full">
                        Halal
                    </span>
                </div>

                {/* Stock Badge */}
                <div className="absolute top-3 right-3">
                    {getStockBadge()}
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="text-xl font-bold text-maroon mb-2">{flavor.name}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {flavor.description || 'Delicious shawarma made with fresh ingredients'}
                </p>

                {/* Pricing */}
                <div className="flex items-center gap-4 mb-4">
                    <div className="flex flex-col">
                        <span className="text-sm text-gray-500">Single</span>
                        <span className="text-lg font-bold text-maroon">₹{flavor.price_single}</span>
                    </div>
                    <div className="h-8 w-px bg-gray-200" />
                    <div className="flex flex-col">
                        <span className="text-sm text-gray-500">Double</span>
                        <span className="text-lg font-bold text-orange">₹{flavor.price_double}</span>
                    </div>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 bg-gray-100 rounded-full px-3 py-1">
                        <button
                            onClick={() => setQty(Math.max(1, qty - 1))}
                            disabled={isOutOfStock}
                            className="p-1 text-maroon hover:bg-maroon/10 rounded-full transition-colors disabled:opacity-50"
                        >
                            <Minus size={18} />
                        </button>
                        <span className="font-bold text-maroon w-6 text-center">{qty}</span>
                        <button
                            onClick={() => setQty(Math.min(flavor.in_stock, qty + 1))}
                            disabled={isOutOfStock || qty >= flavor.in_stock}
                            className="p-1 text-maroon hover:bg-maroon/10 rounded-full transition-colors disabled:opacity-50"
                        >
                            <Plus size={18} />
                        </button>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${isOutOfStock
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : 'bg-orange text-white hover:bg-orange/90 shadow-md shadow-orange/30'
                            }`}
                    >
                        <ShoppingCart size={18} />
                        Add
                    </motion.button>
                </div>
            </div>
        </motion.div>
    )
}
