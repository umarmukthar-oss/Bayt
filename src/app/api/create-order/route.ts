import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

interface OrderItem {
    flavor_id: string
    name: string
    qty: number
    unit_price: number
}

interface CreateOrderRequest {
    items: OrderItem[]
    subtotal: number
    discount: number
    total: number
    offerApplied: string | null
    phone: string
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()

        // Get authenticated user
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body: CreateOrderRequest = await request.json()
        const { items, subtotal, discount, total, offerApplied, phone } = body

        // Validate stock availability
        for (const item of items) {
            const { data: flavor } = await supabaseAdmin
                .from('flavors')
                .select('in_stock, name')
                .eq('id', item.flavor_id)
                .single()

            if (!flavor) {
                return NextResponse.json(
                    { error: `Item ${item.name} not found` },
                    { status: 400 }
                )
            }

            if (flavor.in_stock < item.qty) {
                return NextResponse.json(
                    { error: `Insufficient stock for ${flavor.name}. Only ${flavor.in_stock} available.` },
                    { status: 400 }
                )
            }
        }

        // MOCK RAZORPAY ORDER
        const mockRazorpayOrderId = `order_mock_${Date.now()}`

        // Create order in database
        const { data: order, error: orderError } = await supabaseAdmin
            .from('orders')
            .insert({
                user_id: user.id,
                phone,
                items,
                subtotal,
                discount,
                total_amount: total,
                status: 'pending',
                offer_applied: offerApplied,
                razorpay_order_id: mockRazorpayOrderId,
            })
            .select()
            .single()

        if (orderError) {
            console.error('Order creation error:', orderError)
            return NextResponse.json(
                { error: 'Failed to create order' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            order_id: order.id,
            razorpay_order_id: mockRazorpayOrderId,
            amount: total * 100,
        })
    } catch (error) {
        console.error('Create order error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
