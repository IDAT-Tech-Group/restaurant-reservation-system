import Button from '../ui/Button.jsx'

const STATS = [
  { value: '4.9⭐', label: 'Calificación' },
  { value: '12k+', label: 'Clientes felices' },
  { value: '8 años', label: 'De experiencia' },
  { value: '15', label: 'Mesas disponibles' },
]

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-8 overflow-hidden bg-bg dark:bg-dark-bg text-center">
      {/* Decorative blobs */}
      <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] rounded-full bg-gold/20 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full bg-blue-400/15 blur-[80px] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-surface dark:bg-dark-surface border border-border-col dark:border-dark-border rounded-pill px-4 py-2 text-sm font-bold text-ink-soft dark:text-ink-ghost mb-6 shadow-sm2">
          <span className="text-gold-dark">⭐</span>
          Más de 500 reservas este mes
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-ink dark:text-white tracking-tight leading-[1.05] mb-5">
          Una experiencia{' '}
          <em className="not-italic text-gold-dark">inolvidable</em>{' '}
          te espera
        </h1>

        <p className="text-lg text-ink-soft dark:text-ink-ghost max-w-xl mx-auto mb-10 leading-relaxed">
          Reserva tu mesa en segundos, sin llamadas ni esperas. Gastronomía italiana auténtica en el corazón de la ciudad.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Button as="a" variant="primary" size="lg" href="#reservar">
            🗓️ Reservar ahora
          </Button>
          <Button as="a" variant="outline" size="lg" href="#menu">
            📖 Ver menú
          </Button>
        </div>

        <div className="flex justify-center gap-12 mt-16 flex-wrap">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-black text-ink dark:text-white tracking-tight">{value}</div>
              <div className="text-xs font-bold uppercase tracking-widest text-ink-ghost mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
