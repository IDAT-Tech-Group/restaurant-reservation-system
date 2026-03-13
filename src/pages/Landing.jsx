import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Hero from '../components/landing/Hero.jsx'
import Features from '../components/landing/Features.jsx'
import MenuPreview from '../components/landing/MenuPreview.jsx'
import ReservationSection from '../components/landing/ReservationSection/index.jsx'
import Testimonials from '../components/landing/Testimonials.jsx'
import InfoSection from '../components/landing/InfoSection.jsx'

export default function Landing() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash)
      if (el) {
        // Un pequeño timeout asegura que el render inicial haya terminado
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 50)
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [location])

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
