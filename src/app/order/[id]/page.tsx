import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import OrderDetails from './OrderDetails'

interface OrderPageProps {
    params: Promise<{ id: string }>
}

export const dynamic = 'force-dynamic'

export default async function OrderPage({ params }: OrderPageProps) {
    const { id } = await params
    const supabase = await createClient()

    try {
        const { data: order } = await supabase
            .from('orders')
            .select('*')
            .eq('id', id)
            .single()

        if (!order) {
            notFound()
        }

        return <OrderDetails order={order} />
    } catch (error) {
        console.error('Error fetching order:', error)
        notFound()
    }
}
