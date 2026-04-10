import { fetchApi } from './api';

/**
 * SERVICIO DE MENÚ (PLATOS)
 */

export const getMenuItems = async () => {
  return await fetchApi('/platos');
};

export const createMenuItem = async (data) => {
  return await fetchApi('/platos', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};
export const updateMenuItem = async (id, data) => {
  return await fetchApi(`/platos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
};

export const deleteMenuItem = async (id) => {
  return await fetchApi(`/platos/${id}`, {
    method: 'DELETE'
  });
};
