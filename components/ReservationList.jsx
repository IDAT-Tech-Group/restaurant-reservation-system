import { Clock, Calendar as CalendarIcon, Users, Edit2, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { useReservations } from '../context/ReservationContext';

export default function ReservationList({ selectedDate }) {
    const { reservations, deleteReservation, updateReservationStatus } = useReservations();

    // Formatear date a YYYY-MM-DD local para comparar
    // usando un pequeño truco para evitar desfases de zona horaria:
    const offset = selectedDate.getTimezoneOffset();
    const rawDate = new Date(selectedDate.getTime() - (offset * 60 * 1000));
    const dateString = rawDate.toISOString().split('T')[0];

    const filteredReservations = reservations.filter(res => res.date === dateString);

    const displayDate = selectedDate.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CalendarIcon color="var(--primary)" size={24} />
                        Reservas para:
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'capitalize' }}>{displayDate}</p>
                </div>
                <span style={{ background: 'var(--background)', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                    {filteredReservations.length} {filteredReservations.length === 1 ? 'reserva' : 'reservas'}
                </span>
            </div>

            <div className="reservation-list">
                {filteredReservations.map((res) => (
                    <div key={res.id} className="reservation-item" style={{ borderLeft: `4px solid ${res.status === 'confirmed' ? 'var(--success)' : 'var(--warning)'}` }}>
                        <div className="res-item-info">
                            <h4>{res.name} <span style={{ fontSize: '0.85rem', color: 'var(--secondary)', fontWeight: 'normal' }}>({res.table})</span></h4>
                            <div className="res-item-details">
                                <span><Clock size={14} /> {res.time}</span>
                                <span><Users size={14} /> {res.guests} pers.</span>
                                {res.notes && (
                                    <span style={{ fontStyle: 'italic', gridColumn: '1 / -1', marginTop: '4px' }}>
                                        "{res.notes}"
                                    </span>
                                )}
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} className="res-actions">
                            <span className={`res-status status-${res.status}`}>
                                {res.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                            </span>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {res.status === 'pending' && (
                                    <button
                                        onClick={() => updateReservationStatus(res.id, 'confirmed')}
                                        className="btn-outline"
                                        style={{ padding: '0.4rem', border: 'none', color: 'var(--success)' }}
                                        title="Confirmar"
                                    >
                                        <CheckCircle2 size={18} />
                                    </button>
                                )}
                                {res.status === 'confirmed' && (
                                    <button
                                        onClick={() => updateReservationStatus(res.id, 'pending')}
                                        className="btn-outline"
                                        style={{ padding: '0.4rem', border: 'none', color: 'var(--warning)' }}
                                        title="Marcar Pendiente"
                                    >
                                        <XCircle size={18} />
                                    </button>
                                )}
                                <button
                                    onClick={() => deleteReservation(res.id)}
                                    className="btn-outline"
                                    style={{ padding: '0.4rem', border: 'none', color: 'var(--danger)' }}
                                    title="Eliminar"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredReservations.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                    <CalendarIcon size={48} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
                    <p>No hay reservas para la fecha seleccionada.</p>
                </div>
            )}
        </div>
    );
}
