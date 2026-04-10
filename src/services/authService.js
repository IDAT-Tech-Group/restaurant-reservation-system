import { fetchApi } from './api';

/**
 * SERVICIO DE AUTENTICACIÓN
 */

export const login = async (credentials) => {
  // credentials debería tener { email, password }
  // Laravel suele usar 'email' en lugar de 'username'
  const payload = {
    username: credentials.username || credentials.email,
    password: credentials.password
  };

  const response = await fetchApi('/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  return response; // En base a la guía, retornará { token, user }
};

export const logout = async () => {
  return await fetchApi('/logout', { method: 'POST' });
};
