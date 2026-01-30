'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import MenuCard from '@/components/MenuCard'
import { Flavor } from '@/lib/types'
import { useCart } from '@/contexts/CartContext'
import { motion } from 'framer-motion'

export default function MenuSection() {
    const [flavors, setFlavors] = useState<Flavor[]>([])
    const [loading, setLoading] = useState(true)
    const { setOffers } = useCart()
    const supabase = createClient()

    useEffect(() => {
        const fetchData = async () => {
            const [flavorsRes, offersRes] = await Promise.all([
                supabase.from('flavors').select('*').order('name'),
                supabase.from('offers').select('*').eq('active', true),
            ])

            if (flavorsRes.data) setFlavors(flavorsRes.data as Flavor[])
            if (offersRes.data) setOffers(offersRes.data)
            setLoading(false)
        }

        fetchData()
    }, [])

    return (
        <section id="menu" className="py-16 px-4 sm:px-6 lg:px-8 bg-cream">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl font-bold text-maroon font-serif mb-4">
                        Our Menu
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Choose from our selection of authentic, halal-certified shawarmas.
                        Each one is prepared fresh with premium ingredients.
                    </p>
                </motion.div>

                {loading ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-2xl h-80 animate-pulse"
                            />
                        ))}
                    </div>
                ) : flavors.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <p>No menu items available at the moment.</p>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {flavors.map((flavor, index) => (
                            <MenuCard key={flavor.id} flavor={flavor} index={index} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
