'use client'

import { motion } from 'framer-motion'
import { Tag, Percent, Gift } from 'lucide-react'
import { Offer } from '@/lib/types'

interface OffersBannerProps {
    offers: Offer[]
}

export default function OffersBanner({ offers }: OffersBannerProps) {
    const activeOffers = offers.filter((o) => o.active)

    if (activeOffers.length === 0) return null

    const getOfferIcon = (type: string) => {
        switch (type) {
            case 'percentage':
                return <Percent size={20} />
            case 'bundle':
                return <Gift size={20} />
            default:
                return <Tag size={20} />
        }
    }

    return (
        <section className="bg-gradient-to-r from-maroon to-maroon/90 py-4 overflow-hidden">
            <motion.div
                animate={{ x: [0, -50, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                className="whitespace-nowrap"
            >
                <div className="flex items-center gap-12 px-4">
                    {[...activeOffers, ...activeOffers].map((offer, index) => (
                        <motion.div
                            key={`${offer.id}-${index}`}
                            className="flex items-center gap-3 text-white"
                        >
                            <span className="p-2 bg-white/20 rounded-full">
                                {getOfferIcon(offer.type)}
                            </span>
                            <div>
                                <span className="font-bold">{offer.title}</span>
                                {offer.description && (
                                    <span className="text-white/80 ml-2">— {offer.description}</span>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    )
}
