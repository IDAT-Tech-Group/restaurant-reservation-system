import { fetchApi } from './api';
import { MENU_ITEMS } from '../constants/menuItems';

/**
 * SERVICIO DE MENÚ (PLATOS)
 * 
 * Por ahora devuelve datos simulados usando Promesas.
 * Cuando el backend de Laravel esté listo, descomenta la llamada real de fetchApi()
 */

export const getMenuItems = async () => {
  // --- Futura llamada a Laravel ---
  // return await fetchApi('/listarplatos');
  
  // --- Simulación temporal ---
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MENU_ITEMS);
    }, 500); 
  });
};

export const createMenuItem = async (data) => {
  // --- Futura llamada a Laravel ---
  // return await fetchApi('/registrarplato', {
  //    method: 'POST',
  //    body: JSON.stringify(data)
  // });
  
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Plato registrado localmente:', data);
      resolve({ success: true, data });
    }, 500);
  });
};
