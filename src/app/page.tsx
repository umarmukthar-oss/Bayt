import Hero from '@/components/Hero'
import MenuSection from './MenuSection'
import OffersSection from './OffersSection'

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <>
      <Hero />
      <OffersSection />
      <MenuSection />
    </>
  )
}
