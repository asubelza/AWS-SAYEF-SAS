// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // { first_name, last_name, email, role, ... }
  const [token, setToken] = useState(null);     // JWT
  const [loading, setLoading] = useState(true); // para el arranque

  // 🔹 Cargar token de localStorage y traer usuario actual
  const fetchCurrentUser = async (existingToken) => {
    try {
      if (!existingToken) {
        setUser(null);
        return;
      }

      const res = await fetch(`${API_BASE}/api/users/current`, {
        headers: {
          Authorization: `Bearer ${existingToken}`,
        },
      });

      if (!res.ok) {
        setUser(null);
        setToken(null);
        localStorage.removeItem("authToken");
        return;
      }

      const data = await res.json();
      // tu backend devuelve { status, payload }
      setUser(data.payload || data.user || null);
    } catch (error) {
      console.error("Error obteniendo usuario actual:", error);
      setUser(null);
      setToken(null);
      localStorage.removeItem("authToken");
    }
  };

  useEffect(() => {
    (async () => {
      const savedToken = localStorage.getItem("authToken");
      if (savedToken) {
        setToken(savedToken);
        await fetchCurrentUser(savedToken);
      }
      setLoading(false);
    })();
  }, []);

  // 🔹 Login con email + password
  const login = async ({ email, password }) => {
    try {
      const res = await fetch(`${API_BASE}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // credentials: "include", // si usáramos cookies httpOnly, pero acá usamos JWT en header
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.status !== "success") {
        throw new Error(data.message || "Error al iniciar sesión");
      }

      const jwt = data.token;
      const safeUser = data.payload || data.user || null;

      if (jwt) {
        setToken(jwt);
        localStorage.setItem("authToken", jwt);
      }
      setUser(safeUser);

      return { ok: true };
    } catch (error) {
      console.error(error);
      return { ok: false, message: error.message };
    }
  };

  // 🔹 Login con Google (recibe data de /api/users/google)
  const loginWithToken = (data) => {
    try {
      if (!data || data.status !== "success") {
        return { ok: false, message: data?.message || "Error al iniciar sesión" };
      }

      const jwt = data.token;
      const safeUser = data.payload || data.user || null;

      if (jwt) {
        setToken(jwt);
        localStorage.setItem("authToken", jwt);
      }
      setUser(safeUser);

      return { ok: true };
    } catch (error) {
      console.error(error);
      return { ok: false, message: error.message };
    }
  };

  // 🔹 Logout
  const logout = async () => {
    try {
      // si tenés un endpoint de logout en el backend, lo podés llamar igual:
      await fetch(`${API_BASE}/api/users/logout`, {
        method: "GET",
        // credentials: "include",
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("authToken");
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    loginWithToken,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
