import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DarkModeProvider } from './context/DarkModeContext.jsx'
import { ReservationsProvider } from './context/ReservationsContext.jsx'
import { SettingsProvider } from './context/SettingsContext.jsx'
import LandingLayout from './layouts/LandingLayout.jsx'
import Landing from './pages/Landing.jsx'
import Dashboard from './pages/Dashboard.jsx'

export default function App() {

  const basePath = import.meta.env.BASE_URL  || "/parcial-di-2/"

  return (
    <DarkModeProvider>
      <SettingsProvider>
      <ReservationsProvider>
        <BrowserRouter basename={basePath}>
          <Routes>
            <Route path="/" element={<LandingLayout />}>
              <Route index element={<Landing />} />
            </Route>
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </BrowserRouter>
      </ReservationsProvider>
      </SettingsProvider>
    </DarkModeProvider>
  )
}
