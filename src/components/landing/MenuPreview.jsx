import Button from '../ui/Button.jsx'
import { MENU_ITEMS } from '../../constants/menuItems.js'

export default function MenuPreview() {
  return (
    <section id="menu" className="bg-bg dark:bg-dark-bg py-24 px-8">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div>
          <span className="bg-gold text-ink text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-pill">Nuestra carta</span>
          <h2 className="text-4xl md:text-5xl font-black text-ink dark:text-white tracking-tight mt-4 mb-4">Sabores que te harán volver</h2>
          <p className="text-ink-soft dark:text-ink-ghost leading-relaxed mb-8">Una selección de nuestros platos más populares, preparados con amor y tradición italiana.</p>
          <Button as="a" variant="primary" href="#reservar">Reservar y disfrutar →</Button>
        </div>
        <div className="flex flex-col gap-4">
          {MENU_ITEMS.map(({ emoji, name, description, price }) => (
            <div key={name} className="bg-surface dark:bg-dark-surface rounded-xl2 p-4 flex items-center gap-4 shadow-sm2 hover:translate-x-1.5 transition-transform duration-200">
              <div className="w-12 h-12 bg-bg dark:bg-dark-bg rounded-xl flex items-center justify-center text-2xl shrink-0">{emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="font-black text-sm text-ink dark:text-white">{name}</div>
                <div className="text-xs text-ink-soft dark:text-ink-ghost mt-0.5 truncate">{description}</div>
              </div>
              <div className="font-black text-ink dark:text-white shrink-0">{price}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
