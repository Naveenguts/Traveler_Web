import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Load from localStorage if present
    try {
      const raw = localStorage.getItem("traveler_user");
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  const login = (userData) => {
    setUser(userData);
    try { localStorage.setItem("traveler_user", JSON.stringify(userData)); } catch (e) {}
  };

  const logout = () => {
    setUser(null);
    try { localStorage.removeItem("traveler_user"); } catch (e) {}
  };

  const updateUser = (updates) => {
    setUser((prev) => {
      const next = { ...(prev || {}), ...updates };
      try { localStorage.setItem("traveler_user", JSON.stringify(next)); } catch (e) {}
      return next;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
