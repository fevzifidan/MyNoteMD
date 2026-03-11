// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import apiService from "@/shared/services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Uygulama ilk açıldığında token'ı kontrol et
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      
      if (token) {
        try {
            const userData = await apiService.get("/account/me");
            setUser(userData.user);
        } catch (error) {
            console.log(error);
            // Token is not valid
            setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // 2. Login Fonksiyonu
  const login = async (credentials) => {
    // credentials = { email, password }
    const response = await apiService.post("/auth/login", credentials);
    if (response){
      const antiforgeryResponse = await apiService.get("auth/csrf-token")
      localStorage.setItem("token", antiforgeryResponse.token);
    } else {
      return false;
    }
    setUser(response.user);
    return true;
  };

  // 3. Logout Fonksiyonu
  const logout = async () => {
    const response = await apiService.post("/auth/logout")
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
        {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth, AuthProvider içinde kullanılmalıdır.");
  }
  return context;
};