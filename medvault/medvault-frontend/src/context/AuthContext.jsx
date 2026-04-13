import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const savedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (token && savedUser && savedUser !== "undefined" && savedUser !== "null") {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error("Auth initialization failed", e);
          localStorage.clear();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userData.token);
    localStorage.setItem('role', userData.role);
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {/* Do not render children until we know the auth state */}
      {!loading ? children : (
        <div className="h-screen w-screen flex items-center justify-center bg-white">
          <div className="animate-pulse text-blue-600 font-bold">Initializing MedVault...</div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);