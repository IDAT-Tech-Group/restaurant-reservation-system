/**
 * Cliente HTTP centralizado usando Fetch nativo.
 * Esto facilitará agregar tokens de autenticación (Bearer) en el futuro
 * y estandariza el manejo de respuestas y errores.
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/**
 * Función genérica para ejecutar peticiones fetch con configuraciones predeterminadas.
 */
export async function fetchApi(endpoint, options = {}) {
  // Aseguramos que la url tenga un formato correcto
  const url = endpoint.startsWith('/') ? `${API_URL}${endpoint}` : `${API_URL}/${endpoint}`;
  
  // Configuramos las cabeceras por defecto
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };

  // Aquí en el futuro puedes obtener tu token y asignarlo:
  // const token = localStorage.getItem('token');
  // if (token) {
  //   headers['Authorization'] = `Bearer ${token}`;
  // }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    // Si la respuesta no es OK (ej. 404, 500)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error HTTP: ${response.status}`);
    }

    // Convertimos la respuesta a JSON automáticamente para no tener que hacerlo en los servicios
    return await response.json();
  } catch (error) {
    // Aquí se podrían manejar errores globales como redireccionar al login si es 401
    console.error(`Error en la petición a ${endpoint}:`, error);
    throw error;
  }
}
