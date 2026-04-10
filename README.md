# Restaurant Reservation System (Full-Stack React + Laravel)

## Descripción del Proyecto

Restaurant Reservation System es una plataforma web completa e interactiva para la gestión de reservas de mesas en un restaurante. Recientemente, se ha integrado por completo como un ecosistema **Full-Stack**, enlazando una interfaz construida en **React** con una sólida base de backend construida en **Laravel**.

Este proyecto no solo abarca al usuario final (quien reserva su mesa visualizando la disponibilidad en tiempo real), sino también un riguroso **Dashboard Administrativo** para que los dueños del restaurante gestionen las zonas, turnos, clientes y su propio Menú o Carta.

---

## 🏗️ Arquitectura e Integración (Laravel API)

El Frontend interactúa de forma viva y dinámica con la base de datos SQL conectándose a la REST API de Laravel mediante peticiones `fetch` asíncronas.

| Endpoints Principales | Verbo | Descripción General (Qué Hace) |
| :--- | :---: | :--- |
| `/api/login` | **POST** | Genera Tokens de Autenticación (Bearer JWT / Sanctum) usando el email (`username`). |
| `/api/platos` | **GET / POST / PUT / DELETE** | Mantenimiento completo de la Carta. Alimenta al módulo Dashboard y a la página pública (Landing). |
| `/api/reservas` | **GET / POST / PATCH / DELETE** | El núcleo del negocio. Administra horarios de superposición y arroja Status `422` en caso de overbooking. |
| `/api/horarios` | **GET** | Proveedor de Turnos Dinámicos (ej. 1 Hora, 2 horas), calculado dependiendo de la capacidad configurada. |

> Todo el tráfico protegido intercepta el LocalStorage y envía cabeceras de autorización `Authorization: Bearer <token>` automáticamente.

---

## 🗂️ Guía de Exposición (Estructura de Archivos React)

A la hora de presentar o estudiar el proyecto, debes conocer dónde se esconden los "motores" más importantes de la regla de negocio. Todos están ubicados dentro de la carpeta `src/`.

### 1. La Capa de Servicios (`src/services/`)
Aquí es donde React "habla" directamente con Laravel:
* **`api.js`**: El corazón de la conexión. Es un interceptor en miniatura que inyecta los *headers* (como `Accept: application/json` y el `Bearer Token`) en todas las peticiones para no repetirlos.
* **`menuService.js`**: Contiene las funciones CRUD para enviar y modificar platillos en la base de datos.
* **`authService.js`**: Ejecuta consultas de inicio/cierre de sesión empaquetando adecuadamente las credenciales (pasando el campo `email` al requerimiento `username` del Backend).
* **`reservationsService.js`**: Apunta a `/api/reservas`. Transmite los comandos para aprobar o eliminar reservas.

### 2. La Capa de Estado o Contexto Global (`src/context/`)
* **`AuthContext.jsx`**: Entidad global. Avisa a toda la aplicación (Navbar, Sidebar, Landing) si el usuario es Visitante, Cliente Normal o Administrador interactuando con su sesión activa.
* **`ReservationsContext.jsx`**: Un gestor masivo que dispara múltiples peticiones HTTP en paralelo (`Promise.all`) recolectando al iniciar las Zonas, Horarios y Mapeo de Mesas.

### 3. Las Vistas Administrativas (`src/components/dashboard/views/`)
Son los componentes estrella del proyecto "privado". Han sido refactorizados para mapear la data relacional traída desde Eloquent (*Snake Case* del estilo `table_id`, `start_time`).
* **`DashboardView.jsx`**: Brinda indicadores estadísticos procesando la matriz de reservaciones de hoy.
* **`CalendarView.jsx`**: Renderiza un calendario personalizado que agrupa lógicamente cuantas reservas hubo cada día bajo un sistema de colores.
* **`ReservationsView.jsx`**: Grilla completa con soporte para desdoblar las relaciones anidadas JSON de Laravel (el cliente asociado, las zonas y auto-asignaciones).
* **`DishesView.jsx`**: Incorporación reciente; el gestor CRUD de Platos de forma amigable (emoji, texto, número) para evitar que el Administrador tenga que tocar código.

---

## 🚀 Configuración y Puesta en Marcha Local

### 1. Iniciar el Backend (Base de Datos y Laravel)
- Importar manualmente el archivo de datos masivos `test_data.sql` (que incluye platos pre-confeccionados, horarios codificados y usuarios) dentro de tu servidor local MySQL / MariaDB (usando PhpMyAdmin, por ejemplo). Asegúrate de que el documento utiliza *UTF-8*.
- Ir a la carpeta raíz de tu API Laravel en tu entorno y ejecutar:
```bash
php artisan serve
```
*(Asumiendo que corre por defecto en `http://localhost:8000`)*

### 2. Iniciar el Frontend (React + Vite)
En la carpeta local de este mismo repositorio:

```bash
# 1. Instalar modulos (si no lo hiciste antes)
npm install

# 2. Levantar servidor Web y ver cambios interactivos
npm run dev
```

### 3. Credenciales de Prueba Rápida
Puedes acceder para validar el funcionamiento integral al Dashboard usando:
- **Correo (Username)**: `admin@gmail.com`
- **Contraseña**: `password`
