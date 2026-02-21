import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Calendar as CalendarIcon, Info } from 'lucide-react';
import { useReservations } from '../context/ReservationContext';

export default function InteractiveCalendar({ selectedDate, setSelectedDate }) {
    const { reservations } = useReservations();

    // Función para destacar días que tienen reservas
    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const offset = date.getTimezoneOffset();
            const rawDate = new Date(date.getTime() - (offset * 60 * 1000));
            const dateString = rawDate.toISOString().split('T')[0];

            if (reservations.some(res => res.date === dateString)) {
                return 'has-reservations'; // Agregaremos esta clase al CSS global
            }
        }
        return null;
    };

    return (
        <div className="card calendar-container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <CalendarIcon className="text-primary" size={24} color="var(--primary)" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Ocupación de Mesas</h3>
            </div>

            <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                className="react-calendar border-none w-full"
                tileClassName={tileClassName}
            />

            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--background)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <Info size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Selecciona un día en el calendario para filtrar las reservas en la lista adyacente. Los días marcados tienen reservas programadas.
                </p>
            </div>
        </div>
    );
}
