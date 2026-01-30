import { createClient } from '@/lib/supabase/server'
import OffersBanner from '@/components/OffersBanner'
import { Offer } from '@/lib/types'

export default async function OffersSection() {
    try {
        const supabase = await createClient()
        const { data: offers } = await supabase
            .from('offers')
            .select('*')
            .eq('active', true)

        return <OffersBanner offers={(offers as Offer[]) || []} />
    } catch (error) {
        console.error('Error fetching offers:', error)
        return null
    }
}
