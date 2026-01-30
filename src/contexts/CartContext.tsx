'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { CartItem, Cart, Flavor, Offer } from '@/lib/types'

interface CartContextType {
    cart: Cart
    items: CartItem[]
    addItem: (flavor: Flavor, qty: number) => void
    removeItem: (flavorId: string) => void
    updateQuantity: (flavorId: string, qty: number) => void
    clearCart: () => void
    itemCount: number
    offers: Offer[]
    setOffers: (offers: Offer[]) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'bayt-shawarma-cart'

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [offers, setOffers] = useState<Offer[]>([])

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY)
        if (savedCart) {
            try {
                const parsed = JSON.parse(savedCart)
                setItems(parsed)
            } catch (e) {
                console.error('Failed to parse cart from localStorage', e)
            }
        }
    }, [])

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    }, [items])

    const addItem = (flavor: Flavor, qty: number) => {
        setItems((prev) => {
            const existing = prev.find((item) => item.flavor.id === flavor.id)
            if (existing) {
                return prev.map((item) =>
                    item.flavor.id === flavor.id
                        ? { ...item, qty: Math.min(item.qty + qty, flavor.in_stock) }
                        : item
                )
            }
            return [...prev, { flavor, qty: Math.min(qty, flavor.in_stock) }]
        })
    }

    const removeItem = (flavorId: string) => {
        setItems((prev) => prev.filter((item) => item.flavor.id !== flavorId))
    }

    const updateQuantity = (flavorId: string, qty: number) => {
        if (qty <= 0) {
            removeItem(flavorId)
            return
        }
        setItems((prev) =>
            prev.map((item) =>
                item.flavor.id === flavorId
                    ? { ...item, qty: Math.min(qty, item.flavor.in_stock) }
                    : item
            )
        )
    }

    const clearCart = () => {
        setItems([])
    }

    // Calculate totals with offers
    const calculateCart = (): Cart => {
        let subtotal = 0
        let discount = 0
        let offerApplied: string | null = null

        // Calculate subtotal using double pricing when qty >= 2
        items.forEach((item) => {
            if (item.qty >= 2) {
                // Use double price for pairs, single for remainder
                const pairs = Math.floor(item.qty / 2)
                const remainder = item.qty % 2
                subtotal += pairs * item.flavor.price_double + remainder * item.flavor.price_single
            } else {
                subtotal += item.qty * item.flavor.price_single
            }
        })

        // Apply percentage/flat offers
        const percentageOffer = offers.find(
            (o) => o.active && o.type === 'percentage' && o.min_order_amount && subtotal >= o.min_order_amount
        )
        if (percentageOffer && percentageOffer.value) {
            discount = Math.floor(subtotal * (percentageOffer.value / 100))
            offerApplied = percentageOffer.title
        }

        const flatOffer = offers.find(
            (o) => o.active && o.type === 'flat' && o.min_order_amount && subtotal >= o.min_order_amount
        )
        if (flatOffer && flatOffer.value && flatOffer.value > discount) {
            discount = flatOffer.value
            offerApplied = flatOffer.title
        }

        return {
            items,
            subtotal,
            discount,
            total: subtotal - discount,
            offerApplied,
        }
    }

    const cart = calculateCart()
    const itemCount = items.reduce((sum, item) => sum + item.qty, 0)

    return (
        <CartContext.Provider
            value={{
                cart,
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                itemCount,
                offers,
                setOffers,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
