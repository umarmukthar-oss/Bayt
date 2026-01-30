import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase/admin'

interface VerifyPaymentRequest {
    razorpay_payment_id: string
    razorpay_order_id: string
    razorpay_signature: string
    order_id: string
}

export async function POST(request: NextRequest) {
    try {
        const body: VerifyPaymentRequest = await request.json()
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature, order_id } = body

        // MOCK VERIFICATION
        // Skip signature check for mock payments

        // if (generatedSignature !== razorpay_signature) { ... }

        // Get order details
        const { data: order, error: orderError } = await supabaseAdmin
            .from('orders')
            .select('*')
            .eq('id', order_id)
            .single()

        if (orderError || !order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            )
        }

        // Update order status to paid
        const { error: updateError } = await supabaseAdmin
            .from('orders')
            .update({
                status: 'paid',
                razorpay_payment_id,
            })
            .eq('id', order_id)

        if (updateError) {
            console.error('Order update error:', updateError)
            return NextResponse.json(
                { error: 'Failed to update order' },
                { status: 500 }
            )
        }

        // Decrement stock for each item
        for (const item of order.items) {
            // Decrement stock
            const { error: stockError } = await supabaseAdmin.rpc('decrement_stock', {
                flavor_id: item.flavor_id,
                amount: item.qty,
            })

            // If RPC doesn't exist, do it manually
            if (stockError) {
                const { data: flavor } = await supabaseAdmin
                    .from('flavors')
                    .select('in_stock')
                    .eq('id', item.flavor_id)
                    .single()

                if (flavor) {
                    await supabaseAdmin
                        .from('flavors')
                        .update({ in_stock: Math.max(0, flavor.in_stock - item.qty) })
                        .eq('id', item.flavor_id)
                }
            }

            // Log inventory change
            await supabaseAdmin.from('inventory_log').insert({
                flavor_id: item.flavor_id,
                change: -item.qty,
                reason: `Order #${order_id.slice(0, 8)}`,
                order_id,
            })
        }

        return NextResponse.json({
            success: true,
            order_id,
        })
    } catch (error) {
        console.error('Verify payment error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
