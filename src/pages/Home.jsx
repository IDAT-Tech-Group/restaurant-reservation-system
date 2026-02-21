import ReservationForm from '../components/ReservationForm';

export default function Home() {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 className="page-title">Tu mesa ideal te espera</h1>
                <p className="page-subtitle">Disfruta de la mejor gastronomía sin tiempos de espera. Reserva tu lugar en segundos.</p>
            </div>

            <ReservationForm />
        </div>
    );
}
