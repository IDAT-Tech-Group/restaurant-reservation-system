import { useState } from 'react'
import Topbar from '../components/dashboard/Topbar.jsx'
import Sidebar from '../components/dashboard/Sidebar.jsx'
import MobileNav from '../components/dashboard/MobileNav.jsx'
import DashboardView from '../components/dashboard/views/DashboardView.jsx'
import CalendarView from '../components/dashboard/views/CalendarView.jsx'
import ReservationsView from '../components/dashboard/views/ReservationsView.jsx'
import SettingsView from '../components/dashboard/views/SettingsView.jsx'

const VIEWS = {
  dashboard:    DashboardView,
  calendar:     CalendarView,
  reservations: ReservationsView,
  settings:     SettingsView,
}

export default function DashboardLayout() {
  const [activeView, setActiveView] = useState('dashboard')
  const ActiveView = VIEWS[activeView] || DashboardView

  return (
    <div className="min-h-screen bg-bg dark:bg-dark-bg flex flex-col">
      <Topbar />
      <div className="flex flex-1">
        <Sidebar activeView={activeView} onNavigate={setActiveView} />
        <main className="flex-1 p-8 overflow-y-auto pb-24 md:pb-8">
          <ActiveView />
        </main>
      </div>
      <MobileNav activeView={activeView} onNavigate={setActiveView} />
    </div>
  )
}
