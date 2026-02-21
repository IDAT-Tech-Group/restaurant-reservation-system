import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import { ReservationProvider } from './context/ReservationContext';
import './styles/App.css';

function App() {
  return (
    <ReservationProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="admin" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </Router>
    </ReservationProvider>
  );
}

export default App;
