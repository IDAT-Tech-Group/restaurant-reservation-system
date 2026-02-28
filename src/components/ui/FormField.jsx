const INPUT_CLASS = 'w-full bg-bg dark:bg-dark-bg border border-border-col dark:border-dark-border rounded-xl px-4 py-3 text-sm text-ink dark:text-white placeholder:text-ink-ghost focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all'

export default function FormField({ label, id, type = 'text', placeholder, value, onChange, required, as = 'input', children, rows = 3 }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-bold uppercase tracking-wider text-ink-soft dark:text-ink-ghost">
          {label}
        </label>
      )}
      {as === 'textarea' ? (
        <textarea
          id={id}
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={INPUT_CLASS}
        />
      ) : as === 'select' ? (
        <select id={id} value={value} onChange={onChange} required={required} className={INPUT_CLASS}>
          {children}
        </select>
      ) : (
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={INPUT_CLASS}
        />
      )}
    </div>
  )
}
