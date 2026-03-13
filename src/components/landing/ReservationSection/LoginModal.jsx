import { useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import Button from '../../ui/Button.jsx'
import FormField from '../../ui/FormField.jsx'

export default function LoginModal({ isOpen, onClose, onSuccess }) {
  const { login, register } = useAuth()
  
  const [isRegistering, setIsRegistering] = useState(false)
  
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    let result
    if (isRegistering) {
      result = register(name, email, phone, password)
    } else {
      result = login(email, password)
    }

    if (result?.error) {
      setError(result?.error)
      return
    }

    onSuccess() // Cierra el modal y notifica al padre
  }

  const toggleMode = () => {
    setIsRegistering(!isRegistering)
    setError('')
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/70 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-surface dark:bg-dark-surface rounded-xl2 p-8 w-11/12 max-w-md shadow-2xl animate-[popIn_.22s_ease]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-black text-ink dark:text-white">
            {isRegistering ? 'Crea tu cuenta' : 'Inicia Sesión'}
          </h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-bg dark:bg-dark-bg border-0 flex items-center justify-center text-ink-soft dark:text-ink-ghost cursor-pointer hover:bg-border-col transition-colors"
          >✕</button>
        </div>
        
        <p className="text-sm text-ink-soft dark:text-ink-ghost mb-6 leading-relaxed">
          {isRegistering 
            ? 'Regístrate para continuar con tu reserva.' 
            : 'Inicia sesión para poder confirmar tu reserva.'}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {isRegistering && (
            <>
              <FormField 
                label="Nombre completo" 
                id="lm-name" 
                placeholder="Juan Pérez" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
              />
              <FormField 
                label="Teléfono" 
                id="lm-phone" 
                type="tel" 
                placeholder="+1 555 000 0000" 
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
                required 
              />
            </>
          )}

          <FormField 
            label="Email" 
            id="lm-email" 
            type="email" 
            placeholder="correo@ejemplo.com" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
          />

          <FormField 
            label="Contraseña" 
            id="lm-password" 
            type="password" 
            placeholder="••••••••" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
          />

          {error && (
            <p className="text-sm text-red-500 font-semibold bg-red-50 dark:bg-red-900/10 p-2 rounded text-center">
              {error}
            </p>
          )}

          <Button type="submit" variant="gold" size="lg" className="w-full justify-center mt-2">
            {isRegistering ? 'Registrarse y Continuar' : 'Iniciar sesión y Continuar'}
          </Button>

        </form>

        <div className="text-sm text-center mt-6 text-ink-soft dark:text-ink-ghost">
          {isRegistering ? '¿Ya tienes una cuenta?' : '¿No tienes cuenta?'}
          <button 
            type="button" 
            onClick={toggleMode}
            className="text-gold font-semibold hover:underline ml-1 cursor-pointer bg-transparent border-0"
          >
            {isRegistering ? 'Inicia sesión' : 'Regístrate'}
          </button>
        </div>

      </div>
    </div>
  )
}
