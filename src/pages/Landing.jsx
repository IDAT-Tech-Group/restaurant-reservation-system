import Hero from '../components/landing/Hero.jsx'
import Features from '../components/landing/Features.jsx'
import MenuPreview from '../components/landing/MenuPreview.jsx'
import ReservationSection from '../components/landing/ReservationSection/index.jsx'
import Testimonials from '../components/landing/Testimonials.jsx'
import InfoSection from '../components/landing/InfoSection.jsx'

export default function Landing() {
  return (
    <>
      <Hero />
      <Features />
      <MenuPreview />
      <ReservationSection />
      <Testimonials />
      <InfoSection />
    </>
  )
}
