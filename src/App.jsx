import { useMemo } from 'react'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom'
import { DarkModeProvider } from './context/DarkModeContext.jsx'
import { ReservationsProvider } from './context/ReservationsContext.jsx'
import { SettingsProvider } from './context/SettingsContext.jsx'
import LandingLayout from './layouts/LandingLayout.jsx'
import Landing from './pages/Landing.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Login from './pages/Login.jsx'
import Register from "./pages/Register.jsx"
import MyReservations from './pages/MyReservations.jsx'
import { adminDashboardLoader } from './loaders/adminDashboardLoader.js'

export default function App() {

  const basePath = import.meta.env.BASE_URL || "/restaurant-reservation-system/"
  const router = useMemo(
    () =>
      createBrowserRouter(
        createRoutesFromElements(
          <>
            <Route path="/" element={<LandingLayout />}>
              <Route index element={<Landing />} />
              <Route path="my-reservations" element={<MyReservations />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              loader={adminDashboardLoader}
              element={<Dashboard />}
            />
          </>
        ),
        { basename: basePath }
      ),
    [basePath]
  )

  return (
    <DarkModeProvider>
      <SettingsProvider>
      <ReservationsProvider>
        <RouterProvider router={router} />
      </ReservationsProvider>
      </SettingsProvider>
    </DarkModeProvider>
  )
}