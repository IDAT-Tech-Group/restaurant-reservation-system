import { useState, useEffect } from 'react'
import Button from '../../ui/Button.jsx'
import FormField from '../../ui/FormField.jsx'
import { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from '../../../services/menuService.js'

export default function DishesView() {
  const [dishes, setDishes] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingDish, setEditingDish] = useState(null)
  
  const [formData, setFormData] = useState({ name: '', description: '', price: '', emoji: '', category: '' })

  useEffect(() => {
    loadDishes()
  }, [])

  const loadDishes = () => {
    setLoading(true)
    getMenuItems()
      .then(data => setDishes(data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  const handleEdit = (dish) => {
    setEditingDish(dish)
    setFormData({
      name: dish.name,
      description: dish.description,
      price: dish.price,
      emoji: dish.emoji,
      category: dish.category || ''
    })
  }

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de que deseas eliminar este plato?')) {
      await deleteMenuItem(id).catch(console.error)
      loadDishes()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editingDish) {
      await updateMenuItem(editingDish.id, formData).catch(console.error)
    } else {
      await createMenuItem(formData).catch(console.error)
    }
    setEditingDish(null)
    setFormData({ name: '', description: '', price: '', emoji: '', category: '' })
    loadDishes()
  }

  const cancelEdit = () => {
    setEditingDish(null)
    setFormData({ name: '', description: '', price: '', emoji: '', category: '' })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-black text-ink dark:text-white tracking-tight">Menú y Carta 🍽️</h1>
        <p className="text-ink-soft dark:text-ink-ghost mt-1">Gestiona los platos mostrados al público</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_350px] gap-6 items-start">
        {/* Tabla */}
        <div className="bg-surface dark:bg-dark-surface rounded-xl2 overflow-hidden shadow-sm2">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="border-b border-border-col dark:border-dark-border">
                <tr>
                  {['Emoji', 'Nombre', 'Descripción', 'Precio', 'Categoría', 'Acciones'].map(h => (
                    <th key={h} className="px-5 py-4 text-left text-[11px] font-black uppercase tracking-widest text-ink-ghost">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-ink-ghost text-sm">Cargando platos...</td>
                  </tr>
                ) : dishes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-ink-ghost text-sm">No hay platos registrados</td>
                  </tr>
                ) : (
                  dishes.map(d => (
                    <tr key={d.id} className="border-b border-border-col dark:border-dark-border last:border-0 hover:bg-bg dark:hover:bg-dark-bg transition-colors">
                      <td className="px-5 py-4 text-2xl">{d.emoji}</td>
                      <td className="px-5 py-4 text-sm font-semibold text-ink dark:text-white">{d.name}</td>
                      <td className="px-5 py-4 text-sm text-ink-soft dark:text-ink-ghost max-w-xs truncate">{d.description}</td>
                      <td className="px-5 py-4 text-sm font-bold text-ink dark:text-white">${d.price}</td>
                      <td className="px-5 py-4 text-sm text-ink-soft dark:text-ink-ghost">{d.category || 'N/A'}</td>
                      <td className="px-5 py-4">
                        <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEdit(d)}>Editar</Button>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(d.id)}>Eliminar</Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Formulario Lateral */}
        <div className="bg-surface dark:bg-dark-surface rounded-xl2 p-6 shadow-sm2 sticky top-24">
          <h2 className="text-xl font-black text-ink dark:text-white mb-4">
            {editingDish ? 'Editar Plato' : 'Nuevo Plato'}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FormField label="Emoji" id="d-emoji" placeholder="🍝" value={formData.emoji} onChange={e => setFormData({...formData, emoji: e.target.value})} required />
            <FormField label="Nombre" id="d-name" placeholder="Tagliatelle al Ragù" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            <FormField label="Categoría" id="d-cat" placeholder="Pastas" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
            <FormField label="Precio" id="d-price" type="number" step="0.01" placeholder="18.00" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
            
            <div className="flex flex-col gap-1.5 focus-within:text-gold transition-colors">
              <label htmlFor="d-desc" className="text-[11px] font-black uppercase tracking-widest text-ink-ghost">Descripción</label>
              <textarea 
                id="d-desc" 
                rows={3} 
                className="w-full bg-bg dark:bg-dark-bg border border-border-col dark:border-dark-border rounded-xl px-4 py-2.5 text-sm text-ink dark:text-white focus:outline-none focus:border-gold dark:focus:border-gold transition-colors"
                placeholder="Descripción del plato..."
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                required
              />
            </div>

            <div className="flex gap-2 mt-2">
              <Button type="submit" variant="gold" className="flex-1 justify-center">
                {editingDish ? 'Guardar' : 'Crear'}
              </Button>
              {editingDish && (
                <Button type="button" variant="outline" onClick={cancelEdit}>✕</Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
