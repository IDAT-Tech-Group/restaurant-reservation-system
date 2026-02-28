const INFO = [
  {
    icon: '🕐',
    title: 'Horarios',
    content: ['Lun – Jue: 12:00 – 22:00', 'Vie – Sáb: 12:00 – 23:30', 'Domingo: 12:00 – 21:00'],
  },
  {
    icon: '📍',
    title: 'Ubicación',
    content: ['Av. Italia 1245, Piso 1', 'Colonia Centro', 'Lima, Peru', '2 cuadras del Metro Bellas Artes'],
  },
  {
    icon: '📞',
    title: 'Contacto',
    content: ['Tel: +51 923456789', 'WhatsApp: +51 923456789', 'hola@labellataola.pe', 'Respondemos en menos de 1 hora'],
  },
]

export default function InfoSection() {
  return (
    <section id="horarios" className="bg-bg dark:bg-dark-bg py-24 px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <span className="bg-gold text-ink text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-pill">Información</span>
          <h2 className="text-4xl font-black text-ink dark:text-white tracking-tight mt-4">Encuéntranos</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {INFO.map(({ icon, title, content }) => (
            <div key={title} className="bg-surface dark:bg-dark-surface rounded-xl2 p-8 shadow-sm2">
              <div className="text-3xl mb-4">{icon}</div>
              <h3 className="font-black text-ink dark:text-white mb-4">{title}</h3>
              <ul className="list-none p-0 m-0 flex flex-col gap-1">
                {content.map(line => (
                  <li key={line} className={`text-sm leading-relaxed ${line.includes('⛔') ? 'text-red-500 font-bold' : 'text-ink-soft dark:text-ink-ghost'}`}>{line}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
