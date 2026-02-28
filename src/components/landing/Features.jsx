const FEATURES = [
  { emoji: '🗓️', bg: 'bg-gold', title: 'Reserva en segundos', desc: 'Elige tu fecha, hora y número de personas. Sin llamadas, sin esperas. Tu mesa estará lista cuando llegues.' },
  { emoji: '👨‍🍳', bg: 'bg-ink dark:bg-dark-surface2', title: 'Chef con estrella', desc: 'Nuestro chef con 15 años de experiencia prepara cada plato con ingredientes frescos y técnicas italianas.' },
  { emoji: '🌿', bg: 'bg-blue-100 dark:bg-blue-950', title: 'Ingredientes frescos', desc: 'Trabajamos con productores locales para garantizar la frescura y calidad de cada ingrediente en tu plato.' },
  { emoji: '💌', bg: 'bg-pink-100 dark:bg-pink-950', title: 'Confirmación inmediata', desc: 'Recibirás confirmación de tu reserva al instante, con todos los detalles de tu visita.' },
]

export default function Features() {
  return (
    <section id="nosotros" className="bg-surface dark:bg-dark-surface py-24 px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <span className="bg-gold text-ink text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-pill">Por qué elegirnos</span>
          <h2 className="text-4xl md:text-5xl font-black text-ink dark:text-white tracking-tight mt-4 mb-4">Todo lo que necesitas<br />en un solo lugar</h2>
          <p className="text-ink-soft dark:text-ink-ghost max-w-lg mx-auto leading-relaxed">Desde la reserva hasta el postre, cuidamos cada detalle para que tu experiencia sea perfecta.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map(({ emoji, bg, title, desc }) => (
            <div key={title} className="bg-bg dark:bg-dark-bg rounded-xl2 p-7 hover:-translate-y-1 hover:shadow-md2 transition-all duration-200">
              <div className={`w-14 h-14 ${bg} rounded-xl flex items-center justify-center text-2xl mb-5`}>{emoji}</div>
              <h3 className="text-base font-black text-ink dark:text-white mb-2">{title}</h3>
              <p className="text-sm text-ink-soft dark:text-ink-ghost leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
