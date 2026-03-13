# Restaurant Reservation System

## Descripción

Restaurant Reservation System es una aplicación web desarrollada con **React** que permite a los usuarios registrarse, iniciar sesión y realizar reservas de mesas en un restaurante.

El sistema implementa un flujo de autenticación para garantizar que solo los usuarios registrados puedan realizar reservas. De esta manera, cada reserva queda asociada a un usuario específico, permitiendo llevar un control adecuado de las reservas realizadas.

El flujo principal del sistema es el siguiente:

1. Registro o Inicio de Sesión de usuario
2. Selección de fecha, cantidad de personas y **horario dinámico** a través de un panel
3. Selección de una **Zona preferida** (Ej: Terraza, VIP, Junto a ventana)
4. Selección de una mesa específica directamente desde un **mapa interactivo en tiempo real**.
5. Simulación de un **Adelanto de Pago (50%)** a través de la sección "Mis Reservas".
6. Actualización automática del estado ("Pendiente", "Reservado", "Completado").

Además, los **administradores** (`admin@gmail.com`) cuentan con un **Dashboard Administrativo** para:
* Visualizar en tiempo real un calendario interactivo con las mesas agrupadas y con códigos de colores por estado.
* Liberar mesas, confirmar pagos manuales si el cliente falla y gestionar la capacidad del restaurante.

---

## Aplicación publicada

La aplicación puede probarse directamente desde el siguiente enlace:

https://idat-tech-group.github.io/restaurant-reservation-system

---

## Tecnologías utilizadas

- React
- JavaScript
- HTML5
- CSS3
- Node.js
- Vite

---

## Configuración del entorno de desarrollo

Para ejecutar el proyecto de forma local, seguir los siguientes pasos.

### 1. Clonar el repositorio

```bash
git clone https://github.com/idat-tech-group/restaurant-reservation-system.git
```

### 2. Ingresar a la carpeta del proyecto

```bash
cd restaurant-reservation-system
```

### 3. Instalar las dependencias

```bash
npm install
```

### 4. Ejecutar la aplicación

```bash
npm run dev
```
