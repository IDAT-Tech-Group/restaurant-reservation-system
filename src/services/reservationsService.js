import { fetchApi } from './api';

/**
 * SERVICIO DE RESERVAS
 */

export const getReservations = async () => {
  // Según las rutas estándar de Laravel
  return await fetchApi('/reservas');
};

export const createReservation = async (data) => {
  return await fetchApi('/reservas', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

export const deleteReservation = async (id) => {
  return await fetchApi(`/reservas/${id}`, { method: 'DELETE' });
};
