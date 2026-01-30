// Database types for Supabase
export type UserRole = 'customer' | 'admin'

export interface User {
    id: string
    phone: string
    role: UserRole
    created_at: string
}

export interface Flavor {
    id: string
    name: string
    description: string | null
    price_single: number
    price_double: number
    in_stock: number
    image_url: string | null
    halal: boolean
    created_at: string
    updated_at: string
}

export type OfferType = 'percentage' | 'flat' | 'bundle'

export interface Offer {
    id: string
    title: string
    description: string | null
    type: OfferType
    value: number | null
    bundle_qty: number | null
    bundle_price: number | null
    min_order_amount: number | null
    active: boolean
    created_at: string
    updated_at: string
}

export type OrderStatus = 'pending' | 'paid' | 'preparing' | 'ready' | 'delivered' | 'cancelled'

export interface OrderItem {
    flavor_id: string
    name: string
    qty: number
    unit_price: number
}

export interface Order {
    id: string
    user_id: string | null
    phone: string
    items: OrderItem[]
    subtotal: number
    discount: number
    total_amount: number
    status: OrderStatus
    offer_applied: string | null
    razorpay_order_id: string | null
    razorpay_payment_id: string | null
    created_at: string
    updated_at: string
}

export interface InventoryLog {
    id: string
    flavor_id: string
    change: number
    reason: string
    order_id: string | null
    created_at: string
}

// Cart types
export interface CartItem {
    flavor: Flavor
    qty: number
}

export interface Cart {
    items: CartItem[]
    subtotal: number
    discount: number
    total: number
    offerApplied: string | null
}
