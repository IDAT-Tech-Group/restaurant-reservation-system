import { Outlet } from 'react-router-dom'
import LandingNavbar from '../components/landing/LandingNavbar.jsx'
import LandingFooter from '../components/landing/LandingFooter.jsx'

export default function LandingLayout() {
  return (
    <div className="min-h-screen bg-bg dark:bg-dark-bg">
      <LandingNavbar />
      <main>
        <Outlet />
      </main>
      <LandingFooter />
    </div>
  )
}
