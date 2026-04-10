# Restaurant Reservation System - Project Context (Actualizado)

Este documento sirve como referencia rápida de la arquitectura general del proyecto para evitar exploraciones recurrentes. Ha sido mapeado de pies a cabeza tras descargar la versión completa de la rama `main`.

## 🚀 Tecnologías y Arquitectura Base
- **Frontend Framework:** React 19 
- **Herramientas de Build:** Vite + SWC
- **Routing:** React Router v7 (Incluyendo **Loaders**).
- **Styling:** TailwindCSS / Utilidades UI (ej. `cx.js`).
- **Estado Global:** Context API (`AuthContext`, `ReservationsContext`, etc.).

---

## 🗂️ Mapeo Funcional Detallado

La aplicación está seccionada lógicamente en los siguientes módulos o "Entidades":

### 1. 📅 RESERVAS Y HORARIOS (El núcleo)
La gestión de reservas ahora es altamente interactiva.
- **Flujo de Usuario (`Landing.jsx` -> `ReservationFormUI.jsx`):** El cliente primero elige *"Personas, Fecha y Turno"*. Luego, el sistema calcula disponibilidad (cruces de horarios) para desplegar el mapa.
- **Mapa Interactivo (`InteractiveTableMap.jsx`):** Despliega visualmente botones de mesas (ej. `🪑 Mesa 1`). Oculta/Deshabilita visualmente las mesas que no cumplen con la *capacidad (`requiredPersons`)* o que ya están cruzadas en ese horario.
- **Historial (`MyReservations.jsx`):** Página donde los clientes conectados pueden ver sus «Próximas Reservas» y su «Historial Pasado». Incluye la funcionalidad de simular pagos (pasar el status de `pendiente` a `reservado`).
- **Lógica Central (`ReservationsContext.jsx`):** Maneja la validación de qué mesas están libres calculando `date`, `startTime`, y `endTime`. Utiliza `localStorage` de base.

### 2. 👥 CLIENTES, AUTENTICACIÓN Y SEGURIDAD (AUTH)
Se introdujo persistencia estricta de usuarios.
- **Flujo Público y Modal:** Existen páginas globales `Login.jsx` y `Register.jsx`. Adicionalmente existe un `LoginModal.jsx` empotrado en el formulario de reservas (Si un visitante no logueado intenta reservar, le pide login en ventana flotante).
- **Auth Local (`AuthContext.jsx`):** Mantiene el estado en la aplicación. Revisa el listado quemado en `src/constants/users.json`.
- **Protección de Rutas (`adminDashboardLoader.ts`):** Protege el área administrativa verificando antes de cargar el React Router que exista un login y su username coincida con `admin@gmail.com`.

### 3. 🪑 MESAS (Distribución)
- Las mesas lógicas están enlazadas a **Zonas** (ej. Terraza, Interior, Barra).
- Como tal, la app maneja id de mesa y capacidad máxima. Se visualiza a través de `InteractiveTableMap.jsx`.

### 4. 🍽️ PLATOS (Carta Comercial)
- La información gastronómica vive principalente de manera estática en `src/constants/menuItems.js`.
- Se exponen listados en la página inicial (Componentes como `MenuPreview.jsx`), ilustrando nombre, precio y descripción de la comida Italiana de *La Bella Tavola*.

### 5. 🛡️ DASHBOARD DE ADMINISTRACIÓN (Admin)
La vista de control para el staff/administrador.
- **Ruta Protegida:** `/dashboard` accesible solo por `admin`.
- **Organización Visual:** `Sidebar.jsx`, `Topbar.jsx`, y `MobileNav.jsx`.
- **Vistas Internas (`views/`):** Paneles para Ver Lista de Reservas, Calendario de cruces (`CalendarView.jsx`), Cuadro de Mandos principal, y Configuraciones.
- Se puede crear una reserva forzada/manual usando el `NewReservationModal.jsx`.

---

## 📁 Árbol de Directorios Clave (`src/`)

```
src/
├── components/
│   ├── landing/          # Toda la cara pública
│   │   └── ReservationSection/ # (¡NUEVO!) Lógica compleja de formularios, turnos y mapa.
│   ├── dashboard/        # UI administrativa privada
│   └── ui/               # Componentes unitarios genéricos (Buttons, Badges)
├── constants/            # MOCK DATA (reservas, timeSlots, users.json)
├── context/              # Estados Globales (Auth, Reservaciones, Preferencias)
├── lib/                  # Utilidades (Cálculo de tiempos timeUtils.js y clases cx.js)
├── loaders/              # Funciones que cargan/restringen data ANTES de renderizar la ruta.
├── pages/                # Landing, Login, MyReservations, Register, Dashboard
└── services/             # Capa Fetch preparada en sesiones pasadas (api.js, authService.js, etc.)
```

## 📌 Otros Archivos Raíz de Configuración
- `.env` / `.env.example`: URL a la futura API Laravel (`VITE_API_URL`).
- `LARAVEL_API_REQUIREMENTS.md`: El contrato detallado de qué endpoints hay que programar en el backend.
- `package.json`, `vite.config.js`: Setup de React.
