import { fetchApi } from './api';

/**
 * SERVICIO DE RESERVAS
 */

const normalizeReservation = (r) => {
  const tableObj = r.table && typeof r.table === 'object' ? r.table : null;
  const zoneObj  = tableObj?.zone && typeof tableObj.zone === 'object' ? tableObj.zone : null;

  return {
    ...r,
    startTime:   r.startTime   ?? r.start_time,
    endTime:     r.endTime     ?? r.end_time,
    table:       tableObj ? tableObj.number ?? tableObj.id : (r.table_id ?? r.table),
    table_id:    tableObj ? tableObj.id : r.table_id,
    zone:        zoneObj  ? zoneObj.id  : (r.zone_id ?? r.zone),
    zone_name:   zoneObj  ? zoneObj.name : null,
  };
};

export const getReservations = async () => {
  const data = await fetchApi('/reservas');
  return Array.isArray(data) ? data.map(normalizeReservation) : data;
};

export const createReservation = async (data) => {
  const payload = {
    name:       data.name,
    email:      data.email,
    phone:      data.phone,
    date:       data.date,
    start_time: data.startTime,
    end_time:   data.endTime,
    persons:    data.persons,
    zone_id:    data.zone,
    table_id:   data.table,
    notes:      data.notes,
  };
  const response = await fetchApi('/reservas', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  return normalizeReservation(response);
};

export const deleteReservation = async (id) => {
  return await fetchApi(`/reservas/${id}`, { method: 'DELETE' });
};
