import { TESTIMONIALS } from '../../constants/testimonials.js'

export default function Testimonials() {
  return (
    <section className="bg-surface dark:bg-dark-surface py-24 px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <span className="bg-gold text-ink text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-pill">Opiniones</span>
          <h2 className="text-4xl font-black text-ink dark:text-white tracking-tight mt-4 mb-3">Lo que dicen nuestros clientes</h2>
          <p className="text-ink-soft dark:text-ink-ghost">Más de 500 reseñas con calificación de 5 estrellas nos respaldan.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map(({ id, stars, quote, name, initial, date, gold }) => (
            <div key={id} className="bg-bg dark:bg-dark-bg rounded-xl2 p-7">
              <div className="text-gold tracking-widest mb-4">{'★'.repeat(stars)}</div>
              <blockquote className="text-sm text-ink dark:text-white leading-relaxed italic mb-5">"{quote}"</blockquote>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shrink-0 ${gold ? 'bg-gold text-ink' : 'bg-ink dark:bg-dark-surface2 text-white'}`}>{initial}</div>
                <div>
                  <div className="text-sm font-black text-ink dark:text-white">{name}</div>
                  <div className="text-xs text-ink-ghost mt-0.5">{date}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
