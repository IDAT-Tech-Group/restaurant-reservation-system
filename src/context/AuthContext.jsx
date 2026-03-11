import { createContext, useContext, useState } from "react"
import users from "../constants/users.json"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const savedUsers = localStorage.getItem("users")

    if (!savedUsers) {
      return users
    }

    try {
      const parsedSavedUsers = JSON.parse(savedUsers)
      const usersMap = new Map()

      users.forEach((user) => {
        usersMap.set(user.username.toLowerCase(), user)
      })

      parsedSavedUsers.forEach((user) => {
        usersMap.set(user.username.toLowerCase(), user)
      })

      return Array.from(usersMap.values())
    } catch {
      return users
    }
  })

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  )

  const login = (username, password) => {

    const foundUser = registeredUsers.find(
      u => u.username === username && u.password === password
    )

    if (!foundUser) {
      return { error: "Credenciales incorrectas" }
    }

    localStorage.setItem("user", JSON.stringify(foundUser))
    setUser(foundUser)

    return { success: true }
  }

  const register = (name, email, phone, password) => {
    const normalizedEmail = email.trim().toLowerCase()

    const userExists = registeredUsers.some(
      u => u.username.toLowerCase() === normalizedEmail
    )

    if (userExists) {
      return { error: "Ya existe una cuenta con ese email" }
    }

    const newUser = {
      name: name.trim(),
      username: normalizedEmail,
      phone: phone.trim(),
      password,
    }

    const updatedUsers = [...registeredUsers, newUser]
    localStorage.setItem("users", JSON.stringify(updatedUsers))
    localStorage.setItem("user", JSON.stringify(newUser))

    setRegisteredUsers(updatedUsers)
    setUser(newUser)

    return { success: true }
  }

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)