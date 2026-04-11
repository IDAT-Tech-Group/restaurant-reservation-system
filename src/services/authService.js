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

export const register = async (payload) => {
  // El backend requiere 'username' en lugar de 'email'
  const backendPayload = {
    ...payload,
    username: payload.email || payload.username,
  }
  
  return await fetchApi('/register', {
    method: 'POST',
    body: JSON.stringify(backendPayload)
  });
};
