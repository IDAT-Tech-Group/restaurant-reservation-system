import { fetchApi } from './api';

/**
 * SERVICIO DE RESERVAS
 * Centraliza todas las llamadas al API de Laravel relacionadas con reservas.
 * También se encarga de normalizar las respuestas del servidor (snake_case)
 * al formato camelCase que usa el frontend.
 */

/**
 * Normaliza una reserva recibida del API de Laravel al formato esperado por el frontend.
 * Laravel devuelve relaciones anidadas (ej: table como objeto completo con su zona),
 * por lo que se extraen los valores primitivos necesarios.
 *
 * @param {object} r - Objeto reserva crudo del API
 * @returns {object} - Reserva con campos normalizados para el frontend
 */
const normalizeReservation = (r) => {
  // Si `table` viene como objeto (eager-loaded), lo extraemos; si no, es null
  const tableObj = r.table && typeof r.table === 'object' ? r.table : null;
  // La zona viene anidada dentro del objeto mesa (table.zone)
  const zoneObj  = tableObj?.zone && typeof tableObj.zone === 'object' ? tableObj.zone : null;

  return {
    ...r,
    // Unificar start_time (Laravel) con startTime (frontend)
    startTime:   r.startTime   ?? r.start_time,
    // Unificar end_time (Laravel) con endTime (frontend)
    endTime:     r.endTime     ?? r.end_time,
    // Si table es objeto, usar su número de mesa; si no, usar table_id o el valor directo
    table:       tableObj ? tableObj.number ?? tableObj.id : (r.table_id ?? r.table),
    // Preservar el ID numérico de la mesa para referencias internas
    table_id:    tableObj ? tableObj.id : r.table_id,
    // Si la zona viene anidada, extraer su ID; si no, usar zone_id o el valor directo
    zone:        zoneObj  ? zoneObj.id  : (r.zone_id ?? r.zone),
    // Nombre de la zona para mostrar en UI sin necesidad de un lookup adicional
    zone_name:   zoneObj  ? zoneObj.name : null,
  };
};

/**
 * Obtiene las reservas del usuario autenticado.
 * El API de Laravel filtra automáticamente por user_id gracias al token Bearer,
 * por lo que solo devuelve las reservas propias (o todas si es admin).
 *
 * @returns {Promise<object[]>} - Lista de reservas normalizadas
 */
export const getReservations = async () => {
  const data = await fetchApi('/reservas');
  // Normalizar cada reserva para convertir snake_case a camelCase
  return Array.isArray(data) ? data.map(normalizeReservation) : data;
};

/**
 * Crea una nueva reserva enviando los datos al API de Laravel.
 * Convierte los campos camelCase del frontend a snake_case que espera el servidor.
 * Requiere que el usuario esté autenticado (token en localStorage) para que
 * Laravel asocie la reserva al user_id correcto.
 *
 * @param {object} data - Datos del formulario de reserva (camelCase)
 * @returns {Promise<object>} - La reserva creada, normalizada al formato del frontend
 */
export const createReservation = async (data) => {
  // Mapeo explícito de camelCase (frontend) a snake_case (Laravel API)
  const payload = {
    name:       data.name,        // Nombre del cliente (informativo, no se guarda en BD)
    email:      data.email,       // Correo del cliente (informativo)
    phone:      data.phone,       // Teléfono del cliente (informativo)
    date:       data.date,        // Fecha de la reserva (formato YYYY-MM-DD)
    start_time: data.startTime,   // Hora de inicio (formato HH:MM)
    end_time:   data.endTime,     // Hora de fin (formato HH:MM)
    persons:    data.persons,     // Cantidad de personas
    zone_id:    data.zone,        // ID de la zona seleccionada
    table_id:   data.table,       // ID de la mesa seleccionada
    notes:      data.notes,       // Notas adicionales (opcional)
  };
  const response = await fetchApi('/reservas', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  return normalizeReservation(response);
};

/**
 * Elimina una reserva por su ID.
 * Solo el admin o el dueño de la reserva debería poder ejecutar esta acción
 * (la validación se hace en el backend de Laravel).
 *
 * @param {number} id - ID de la reserva a eliminar
 * @returns {Promise<void>}
 */
export const deleteReservation = async (id) => {
  return await fetchApi(`/reservas/${id}`, { method: 'DELETE' });
};

/**
 * Consulta la disponibilidad de mesas ocupadas globalmente (público)
 * para un día específico o general.
 */
export const getDisponibilidad = async (date) => {
  const url = date ? `/disponibilidad?date=${date}` : '/disponibilidad';
  const data = await fetchApi(url);
  return Array.isArray(data) ? data.map(normalizeReservation) : data;
};
