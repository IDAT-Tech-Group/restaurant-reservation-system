import { fetchApi } from './api';
import { INITIAL_RESERVATIONS } from '../constants/reservations';

/**
 * SERVICIO DE RESERVAS
 */

export const getReservations = async () => {
  // --- Futura llamada a Laravel ---
  // return await fetchApi('/listarreservas');
  
  // --- Simulación temporal ---
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(INITIAL_RESERVATIONS);
    }, 500); 
  });
};

export const createReservation = async (data) => {
  // --- Futura llamada a Laravel ---
  // return await fetchApi('/registrarreserva', {
  //    method: 'POST',
  //    body: JSON.stringify(data)
  // });
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const id = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
      resolve({ success: true, data: { ...data, id, status: 'reservado' } });
    }, 500);
  });
};

export const deleteReservation = async (id) => {
  // --- Futura llamada a Laravel ---
  // return await fetchApi(`/eliminarreserva/${id}`, { method: 'DELETE' });
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 500);
  });
};
