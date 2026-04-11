import { createContext, useContext, useState } from "react"
import { login as loginApi, logout as logoutApi, register as registerApi } from "../services/authService"

/**
 * CONTEXTO DE AUTENTICACIÓN
 * Gestiona el estado global del usuario autenticado en toda la aplicación.
 * Persiste la sesión en localStorage para que sobreviva recargas de página.
 * Expone: user, login, logout, register.
 */
const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  // Inicializar el estado del usuario leyendo desde localStorage (sesión persistente)
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user")
      return stored ? JSON.parse(stored) : null
    } catch {
      // Si el valor guardado está corrupto, iniciar sin sesión
      return null
    }
  })

  /**
   * Inicia sesión con email y contraseña.
   * Si el servidor responde con éxito, guarda el token Bearer y los datos
   * del usuario en localStorage para mantener la sesión activa.
   *
   * @param {string} username - Email del usuario
   * @param {string} password - Contraseña
   * @returns {Promise<{success: boolean}|{error: string}>}
   */
  const login = async (username, password) => {
    try {
      const response = await loginApi({ username, password })
      // Laravel Sanctum devuelve { token, user: { id, username, name, role } }
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

  /**
   * Registra una nueva cuenta de usuario.
   * Si el registro es exitoso, también inicia sesión automáticamente
   * guardando el token y los datos del usuario en localStorage.
   *
   * @param {string} name     - Nombre completo
   * @param {string} email    - Correo electrónico
   * @param {string} phone    - Teléfono
   * @param {string} password - Contraseña
   * @returns {Promise<{success: boolean}|{error: string}>}
   */
  const register = async (name, email, phone, password) => {
    try {
      const response = await registerApi({ name, email, phone, password })
      if (response && response.token) {
        localStorage.setItem("token", response.token)
        localStorage.setItem("user", JSON.stringify(response.user))
        setUser(response.user)
        return { success: true }
      }
      return { error: response?.message || "Error al registrar la cuenta" }
    } catch (err) {
      return { error: err.message || "Error de conexión o datos inválidos" }
    }
  }

  /**
   * Cierra la sesión del usuario.
   * Intenta notificar al backend para invalidar el token Sanctum.
   * Independientemente del resultado, limpia localStorage y el estado local.
   */
  const logout = async () => {
    try {
      await logoutApi()
    } catch (e) {
      // Si falla la petición al backend, igual cerramos sesión localmente
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

/**
 * Hook personalizado para consumir el AuthContext.
 * Debe usarse dentro de un componente envuelto por AuthProvider.
 *
 * @returns {{ user, login, logout, register }}
 */
export const useAuth = () => useContext(AuthContext)