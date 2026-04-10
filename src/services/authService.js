import { fetchApi } from './api';
import { MOCK_USERS } from '../constants/users';

/**
 * SERVICIO DE AUTENTICACIÓN
 */

export const login = async (credentials) => {
  // --- Futura llamada a Laravel ---
  // return await fetchApi('/login', {
  //    method: 'POST',
  //    body: JSON.stringify(credentials)
  // });
  
  // --- Simulación temporal ---
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = MOCK_USERS.find(
        (u) => u.username === credentials.username && u.password === credentials.password
      );

      if (user) {
        resolve({ success: true, user, token: 'fake-jwt-token' });
      } else {
        reject(new Error("Credenciales inválidas"));
      }
    }, 500);
  });
};

export const logout = async () => {
  // --- Futura llamada a Laravel ---
  // return await fetchApi('/logout', { method: 'POST' });
  
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), 200);
  });
};
