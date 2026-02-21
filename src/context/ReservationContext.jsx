import { createContext, useState, useContext } from 'react';

const ReservationContext = createContext();

export function useReservations() {
    return useContext(ReservationContext);
}

export function ReservationProvider({ children }) {
    // Estado global de las reservas (datos iniciales de prueba)
    const [reservations, setReservations] = useState([
        {
            id: 1,
            name: 'María García',
            date: new Date().toISOString().split('T')[0], // Hoy
            time: '19:30',
            guests: 4,
            table: 'Mesa 1',
            status: 'confirmed'
        },
        {
            id: 2,
            name: 'Familia López',
            date: new Date().toISOString().split('T')[0], // Hoy
            time: '20:00',
            guests: 6,
            table: 'Mesa 2',
            status: 'confirmed'
        }
    ]);

    const addReservation = (newReservation) => {
        setReservations(prev => [...prev, { ...newReservation, id: Date.now(), status: 'pending' }]);
    };

    const deleteReservation = (id) => {
        setReservations(prev => prev.filter(res => res.id !== id));
    };

    const updateReservationStatus = (id, newStatus) => {
        setReservations(prev => prev.map(res =>
            res.id === id ? { ...res, status: newStatus } : res
        ));
    };

    return (
        <ReservationContext.Provider value={{
            reservations,
            addReservation,
            deleteReservation,
            updateReservationStatus
        }}>
            {children}
        </ReservationContext.Provider>
    );
}
