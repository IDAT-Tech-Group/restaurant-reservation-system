import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import Button from "../components/ui/Button.jsx"
import FormField from "../components/ui/FormField.jsx"

export default function Login() {

  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    const result = login(email, password)

    if (result?.error) {
      setError(result.error)
      return
    }

    if (email.toLowerCase() === "admin@gmail.com") {
      navigate("/dashboard")
    } else {
      navigate("/")
    }
  }

  return (
    <section className="bg-ink dark:bg-dark-bg py-24 px-8 min-h-screen flex items-center justify-center">

      <div className="bg-surface dark:bg-dark-surface rounded-xl2 p-10 shadow-lg2 w-full max-w-md">

        <h2 className="text-3xl font-black text-ink dark:text-white mb-2">
          Iniciar sesión
        </h2>

        <p className="text-sm text-ink-soft dark:text-ink-ghost mb-6">
          Accede a tu cuenta para gestionar tus reservas.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <FormField
            label="Email"
            id="login-email"
            type="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />

          <FormField
            label="Contraseña"
            id="login-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-sm text-red-500 font-semibold">
              {error}
            </p>
          )}

          <Button
            type="submit"
            variant="gold"
            size="lg"
            className="w-full justify-center"
          >
            Iniciar sesión
          </Button>

        </form>

        <div className="text-sm text-center mt-6 text-ink-soft dark:text-ink-ghost">

          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            className="text-gold font-semibold hover:underline"
          >
            Crear una cuenta
          </Link>

        </div>

      </div>

    </section>
  )
}