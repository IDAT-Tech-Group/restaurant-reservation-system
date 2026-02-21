import { useState } from 'react';
import InteractiveCalendar from '../components/InteractiveCalendar';
import ReservationList from '../components/ReservationList';

export default function AdminDashboard() {
    const [selectedDate, setSelectedDate] = useState(new Date());

    return (
        <div>
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 className="page-title">Panel Administrativo</h1>
                <p className="page-subtitle">Gestiona la ocupación de mesas y visualiza reservas en tiempo real.</p>
            </div>

            <div className="admin-grid">
                <div style={{ order: 1 }}>
                    <InteractiveCalendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                </div>
                <div style={{ order: 2 }}>
                    <ReservationList selectedDate={selectedDate} />
                </div>
            </div>
        </div>
    );
}
