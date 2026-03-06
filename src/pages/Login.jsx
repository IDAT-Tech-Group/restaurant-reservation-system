import { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/ui/Button';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Por favor, ingresa usuario y contraseña');
      return;
    }
    
    setIsSubmitting(true);
    
    const result = await login(username, password);
    
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg dark:bg-dark-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <a href="/" className="inline-block text-4xl mb-4 bg-gold w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-gold/20">🍽️</a>
        <h2 className="mt-6 text-3xl font-extrabold text-ink dark:text-white">
          Administración
        </h2>
        <p className="mt-2 text-sm text-ink-soft dark:text-ink-ghost">
          Inicia sesión para acceder al panel de control
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-dark-surface py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-border-col dark:border-dark-border">
          
          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 px-4 py-3 rounded-xl text-xs font-medium">
            <p className="font-bold mb-1">Cuentas de demostración:</p>
            <ul className="list-disc list-inside">
              <li>Usuario: <strong>admin</strong> / Clave: <strong>admin123</strong></li>
              <li>Usuario: <strong>staff</strong> / Clave: <strong>staff123</strong></li>
            </ul>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-ink dark:text-white">
                Usuario
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full px-3 py-2.5 border border-border-col dark:border-dark-border rounded-xl shadow-sm placeholder-ink-soft/50 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold sm:text-sm bg-bg dark:bg-dark-bg text-ink dark:text-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-ink dark:text-white">
                Contraseña
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2.5 border border-border-col dark:border-dark-border rounded-xl shadow-sm placeholder-ink-soft/50 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold sm:text-sm bg-bg dark:bg-dark-bg text-ink dark:text-white transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a href="/" className="font-medium text-gold hover:text-gold-hover transition-colors">
                  ← Volver al inicio
                </a>
              </div>
            </div>

            <div>
              <Button type="submit" variant="gold" className="w-full flex justify-center py-2.5" disabled={isSubmitting}>
                {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
