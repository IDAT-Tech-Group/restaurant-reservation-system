import { createContext, useContext, useState } from "react"
import { login as loginApi, logout as logoutApi } from "../services/authService"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user")
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const login = async (username, password) => {
    try {
      const response = await loginApi({ username, password })
      // Laravel devuelve token y user
      if (response && response.token) {
        localStorage.setItem("token", response.token)
        localStorage.setItem("user", JSON.stringify(response.user))
        setUser(response.user)
        return { success: true }
      }
      return { error: "Formato de respuesta incorrecto del servidor" }
    } catch (err) {
      return { error: err.message || "Credenciales incorrectas o error de conexión" }
    }
  }

  const register = async (name, email, phone, password) => {
    // Opcional, si hay endpoint de /register
    return { error: "El registro será verificado por el Backend con /api/register" }
  }

  const logout = async () => {
    try {
      await logoutApi()
    } catch (e) {
      console.warn("Fallo en logout backend:", e)
    }
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)