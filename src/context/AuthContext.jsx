import { createContext, useContext, useState } from "react"
import users from "../constants/users.json"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  )

  const login = (username, password) => {

    const foundUser = users.find(
      u => u.username === username && u.password === password
    )

    if (!foundUser) {
      return { error: "Credenciales incorrectas" }
    }

    localStorage.setItem("user", JSON.stringify(foundUser))
    setUser(foundUser)

    return { success: true }
  }

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)