import { createContext, useState, useEffect } from 'react';
import { MOCK_USERS } from '../constants/users';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved session on load
    const savedUser = localStorage.getItem('demo_user_session');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error("Failed to parse session", err);
        localStorage.removeItem('demo_user_session');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const foundUser = MOCK_USERS.find(
      u => u.username === username && u.password === password
    );

    if (foundUser) {
      // Remove password before saving to state/localStorage
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('demo_user_session', JSON.stringify(userWithoutPassword));
      return { success: true };
    } else {
      return { success: false, error: 'Usuario o contraseña incorrectos' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('demo_user_session');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
