// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import apiService from "@/shared/services/api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Clear auth state without calling API
  /**
   * Active user session information is cleared.
   */
  const clearAuth = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  useEffect(() => {
    apiService.setUnauthorizedCallback(() => {
      clearAuth();
      navigate("/login");
    });
  }, [clearAuth, navigate]);

  // Check token when application first opens
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const userData = await apiService.get("/account/me");
          setUser(userData.user);
        } catch (error) {
          // Token is not valid
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Login Function
  const login = async (credentials) => {
    // credentials = { email, password }
    const response = await apiService.post("/auth/login", credentials);
    if (response) {
      const antiforgeryResponse = await apiService.get("auth/csrf-token")
      localStorage.setItem("token", antiforgeryResponse.token);
    } else {
      return false;
    }
    setUser(response.user);
    return true;
  };

  // Logout Function
  const logout = async () => {
    try {
      await apiService.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, clearAuth, loading, isAuthenticated: !!user }}>
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