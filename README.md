# Sistema de Gestión de Reservas - Restaurante MesaPerfecta

![Estado](https://img.shields.io/badge/Estado-Completado-success) ![React](https://img.shields.io/badge/React-18.2.0-blue) ![Vite](https://img.shields.io/badge/Vite-5.0.8-purple)

**Curso:** Desarrollo de Interfaces 2 - Evaluación parcial.

## 👥 Equipo (Integrantes)
- [AQUÍ - Nombre del Integrante 1]
- [AQUÍ - Nombre del Integrante 2]
- [AQUÍ - Nombre del Integrante 3]

## 🔗 Enlaces Importantes
- **Diseño (Figma):** [AQUÍ - URL de tu Figma]
- **Repositorio (GitHub):** [AQUÍ - URL de tu Repositorio GitHub]
- **Documento PDF Adjunto:** Se encuentra en [AQUÍ - Ubicación o nombre del archivo PDF, ej: `docs/informe.pdf`]

---

## 📖 Descripción del Proyecto

Aplicación web funcional desarrollada en React (Vite) diseñada para restaurantes, con el objetivo de gestionar las reservas de mesas y solucionar los problemas de duplicación y mala organización en los horarios de alta demanda. 

El proyecto proporciona una solución integral con un **Diseño Responsivo**, **Animaciones y Microinteracciones avanzadas**, y está dividido en dos vistas principales:
1. **Vista de Cliente (Home):** Un formulario de reserva intuitivo con validación inmediata de disponibilidad de fecha, hora y mesas.
2. **Dashboard de Administración:** Un calendario interactivo y una lista de reservas sincronizada en tiempo real que previene las duplicaciones y organiza de forma visual el estado de las mesas.

### 🌟 Funcionalidades Destacadas (Nivel Sobresaliente)
* **Validación Anti-Conflictos en Tiempo Real:** El formulario verifica el contexto de estado iterando sobre todas las reservas en milisegundos para prevenir que una misma mesa se reserve en la misma fecha y hora.
* **Calendario Interactivo Inteligente:** El estado se enlaza con `react-calendar`, visualizando puntos de colores en los días que han recibido reservas y filtrando de inmediato la lista de administración mediante la fecha seleccionada.
* **Componentes UI Modulares:** El código se ha refactorizado usando el patrón de "Design System", separando los inputs y selectores como componentes lógicos independientes y limpios dentro de `src/components/ui`.
* **Microinteracciones y Feedback Visual (UX/UI):** Aplicación extensa de Keyframes CSS para `fade-ins`, `slide-ins` escalonados, animaciones elásticas de éxito (`pop`) y vibraciones orgánicas ante errores (`shake`) asegurando una experiencia táctil y profesional.

---

## ⚙️ Tecnologías Utilizadas
- **Core:** [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/) (Entorno de desarrollo super-rápido).
- **Enrutamiento:** `react-router-dom` v6 para navegación tipo SPA sin recargas.
- **Gestión de Fechas y UI Calendar:** `react-calendar` y el objeto nativo Date (Timezone seguro).
- **Estilos:** Vanilla CSS (Variables globales, Grid, Flexbox y animaciones).
- **Iconografía:** `lucide-react` para iconos minimalistas.
- **Gestión de Estado:** Context API (`createContext`, `useContext`) combinada con React Hooks (`useState`, `useEffect`).

---

## 🚀 Configuración del Entorno local (Cómo ejecutar e instalar)

Para correr la aplicación correctamente en tu máquina, es necesario seguir los siguientes pasos y asegurar que tienes [Node.js](https://nodejs.org/) instalado.

### 1. Clonar el Repositorio
Abre tu terminal y clona el proyecto usando la URL anterior o mediante la descarga en ZIP:
```bash
git clone [AQUÍ - URL de tu Repositorio GitHub]
cd sistema-reservas-react
```

### 2. Instalar Dependencias
Instala todos los módulos necesarios (`react-router-dom`, `lucide-react`, `react-calendar`, entre otros) definidos en el `package.json`:
```bash
npm install
```

### 3. Ejecutar el Servidor de Desarrollo
Una vez descargados los paquetes, puedes iniciar el servidor optimizado por Vite.
```bash
npm run dev
```

### 4. Probar la Aplicación (Navegar)
Vite te devolverá una ruta local (por defecto suele ser `http://localhost:5173/`).
* **Vista Cliente:** Simplemente abre el `localhost` raíz y prueba agregando una nueva reserva.
* **Vista Administrador:** Haz click en "Panel Admin" en la cabecera superior de la web o navega hacia `http://localhost:5173/admin` para gestionar, aceptar o eliminar reservas.

---
> Proyecto desarrollado con enfoque en diseño centrado en el usuario (UX/UI).
