import { useState } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Button from "../components/ui/Button.jsx"
import FormField from "../components/ui/FormField.jsx"

export default function Register() {

  const { register } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!name || !email || !phone || !password) {
      setError("Todos los campos son obligatorios")
      return
    }

    const result = register(name, email, phone, password)

    if (result?.error) {
      setError(result.error)
      return
    }

    setError("")
    navigate("/")
  }

  return (
    <section className="bg-ink dark:bg-dark-bg py-24 px-8 min-h-screen flex items-center justify-center">

      <div className="bg-surface dark:bg-dark-surface rounded-xl2 p-10 shadow-lg2 w-full max-w-md">

        <h2 className="text-3xl font-black text-ink dark:text-white mb-2">
          Crear cuenta
        </h2>

        <p className="text-sm text-ink-soft dark:text-ink-ghost mb-6">
          Regístrate para poder realizar reservas.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <FormField
            label="Nombre completo"
            id="name"
            placeholder="Tu nombre"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            required
          />

          <FormField
            label="Email"
            id="email"
            type="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />

          <FormField
            label="Teléfono"
            id="phone"
            type="tel"
            placeholder="+51 999 999 999"
            value={phone}
            onChange={(e)=>setPhone(e.target.value)}
            required
          />

          <FormField
            label="Contraseña"
            id="password"
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
            Crear cuenta
          </Button>

        </form>

        <div className="text-sm text-center mt-6 text-ink-soft dark:text-ink-ghost">

          ¿Ya tienes cuenta?{" "}
          <Link
            to="/login"
            className="text-gold font-semibold hover:underline"
          >
            Iniciar sesión
          </Link>

        </div>

      </div>

    </section>
  )
}