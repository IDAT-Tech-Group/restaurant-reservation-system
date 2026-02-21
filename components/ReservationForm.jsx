import { useState, useEffect } from 'react';
import { Calendar, Clock, Users, User, ArrowRight, LayoutDashboard, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useReservations } from '../context/ReservationContext';
import { Input } from './ui/Input';
import { Select } from './ui/Select';

export default function ReservationForm() {
    const { reservations, addReservation } = useReservations();

    const [formData, setFormData] = useState({
        name: '',
        date: '',
        time: '',
        guests: '',
        table: '',
        notes: ''
    });

    const [conflictError, setConflictError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Validación en tiempo real con useEffect
    useEffect(() => {
        if (formData.date && formData.time && formData.table) {
            // Buscar si existe una reserva confirmada o pendiente para misma fecha, hora y mesa
            const isConflict = reservations.some(res =>
                res.date === formData.date &&
                res.time === formData.time &&
                res.table === formData.table &&
                res.status !== 'cancelled'
            );

            if (isConflict) {
                setConflictError(`La ${formData.table} ya está ocupada el ${formData.date} a las ${formData.time}. Elige otro horario o mesa.`);
            } else {
                setConflictError('');
            }
        } else {
            setConflictError('');
        }
    }, [formData.date, formData.time, formData.table, reservations]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setSuccessMsg(''); // Limpiar mensaje de éxito al editar
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (conflictError) return;

        // Simular un request con microinteracción de carga y luego estallido (pop) de éxito
        setIsSubmitting(true);

        setTimeout(() => {
            addReservation(formData);
            setSuccessMsg('¡Mesa reservada con éxito!');
            setIsSubmitting(false);
            setFormData({ name: '', date: '', time: '', guests: '', table: '', notes: '' });
        }, 600);
    };

    const isFormValid = formData.name && formData.date && formData.time && formData.guests && formData.table && !conflictError && !isSubmitting;

    // Render condicional estado de éxito con microinteracciones animadas
    if (successMsg) {
        return (
            <div className="card animate-pop" style={{ maxWidth: '550px', margin: '0 auto', textAlign: 'center', padding: '3rem 2rem' }}>
                <CheckCircle2 size={64} color="var(--success)" style={{ margin: '0 auto 1.5rem auto' }} className="animate-pop" />
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.5rem' }}>{successMsg}</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Tu reserva está en estado pendiente de validación por el restaurante.</p>
                <button className="btn-primary" onClick={() => setSuccessMsg('')}>
                    Hacer otra reserva
                </button>
            </div>
        );
    }

    return (
        <div className="card animate-fade-in" style={{ maxWidth: '550px', margin: '0 auto' }}>
            <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)' }}>Reservar una mesa</h3>
                <p style={{ color: 'var(--text-muted)' }}>Complete los datos para asegurar su lugar.</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="animate-slide-in stagger-1">
                    <Input
                        label="Nombre a nombre de la reserva"
                        icon={User}
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Ej: Juan Pérez"
                        required
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="animate-slide-in stagger-2">
                    <Input
                        label="Fecha"
                        icon={Calendar}
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        required
                    />
                    <Input
                        label="Hora"
                        icon={Clock}
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="animate-slide-in stagger-3">
                    <Select
                        label="Personas"
                        icon={Users}
                        name="guests"
                        value={formData.guests}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccione cantidad</option>
                        <option value="1">1 persona</option>
                        <option value="2">2 personas</option>
                        <option value="3">3 personas</option>
                        <option value="4">4 personas</option>
                        <option value="5">5 personas</option>
                        <option value="6+">6 o más</option>
                    </Select>

                    <Select
                        label="Mesa"
                        icon={LayoutDashboard}
                        name="table"
                        value={formData.table}
                        onChange={handleChange}
                        error={conflictError}
                        required
                    >
                        <option value="">Seleccione mesa</option>
                        <option value="Mesa 1">Mesa 1 (Ventana)</option>
                        <option value="Mesa 2">Mesa 2 (Centro)</option>
                        <option value="Mesa 3">Mesa 3 (VIP)</option>
                        <option value="Mesa 4">Mesa 4 (Terraza)</option>
                    </Select>
                </div>

                {conflictError && (
                    <div className="animate-pop" style={{ padding: '0.75rem', background: '#FEE2E2', color: '#B91C1C', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.9rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                        <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <p>{conflictError}</p>
                    </div>
                )}

                <div className="animate-slide-in" style={{ animationDelay: '0.4s', opacity: 0, animationFillMode: 'forwards' }}>
                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <label className="form-label">Notas adicionales (opcional)</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Alergias, celebración especial..."
                            rows="3"
                            style={{ resize: 'none' }}
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        style={{ width: '100%', fontSize: '1.1rem' }}
                        disabled={!isFormValid}
                    >
                        {isSubmitting ? 'Procesando...' : 'Confirmar Reserva'}
                        {!isSubmitting && <ArrowRight size={18} />}
                    </button>
                </div>
            </form>
        </div>
    );
}
