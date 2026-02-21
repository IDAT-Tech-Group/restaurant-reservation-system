import { Outlet, NavLink } from 'react-router-dom';
import { CalendarDays, Settings } from 'lucide-react';

export default function MainLayout() {
    return (
        <div className="app-container">
            <header className="header">
                <div className="header-title">
                    <CalendarDays size={28} />
                    MesaPerfecta
                </div>
                <nav className="nav-links">
                    <NavLink
                        to="/"
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        end
                    >
                        Vista Cliente
                    </NavLink>
                    <NavLink
                        to="/admin"
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                        <Settings size={18} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
                        Panel Admin
                    </NavLink>
                </nav>
            </header>

            <main className="main-content">
                <Outlet />
            </main>

            <footer style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
                <p>&copy; 2023 MesaPerfecta. Sistema de Gestión de Reservas.</p>
            </footer>
        </div>
    );
}
