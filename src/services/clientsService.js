import { fetchApi } from './api';

/**
 * SERVICIO DE CLIENTES
 * 
 * Preparado para cuando Laravel maneje a los clientes por separado.
 */

export const getClients = async () => {
  // --- Futura llamada a Laravel ---
  // return await fetchApi('/listarclientes');
  
  // --- Simulación temporal (lista vacía) ---
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([]);
    }, 500); 
  });
};

export const createClient = async (data) => {
  // --- Futura llamada a Laravel ---
  // return await fetchApi('/registrarcliente', {
  //    method: 'POST',
  //    body: JSON.stringify(data)
  // });
  
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Cliente registrado localmente:', data);
      resolve({ success: true, data });
    }, 500);
  });
};
