// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Helpers
  const saveToken = (jwt) => {
    setToken(jwt);
    localStorage.setItem("authToken", jwt);
  };

  const clearSession = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
  };

  // 🔹 Traer usuario actual usando Bearer token
  const fetchCurrentUser = async (jwt = token) => {
    try {
      if (!jwt) {
        setUser(null);
        return null;
      }

      const res = await fetch(`${API_BASE}/api/users/current`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (!res.ok) {
        clearSession();
        return null;
      }

      const data = await res.json().catch(() => ({}));
      const u = data.payload || data.user || null;

      setUser(u);
      return u;
    } catch (error) {
      console.error("Error obteniendo usuario actual:", error);
      clearSession();
      return null;
    }
  };

  // 🔹 Al iniciar: cargar token y pedir /current
  useEffect(() => {
    (async () => {
      const savedToken = localStorage.getItem("authToken");
      if (savedToken) {
        saveToken(savedToken);
        await fetchCurrentUser(savedToken);
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🔹 Login email/password
  const login = async ({ email, password }) => {
    try {
      const res = await fetch(`${API_BASE}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.status !== "success") {
        throw new Error(data.message || "Error al iniciar sesión");
      }

      const jwt = data.token;
      const safeUser = data.payload || data.user || null;

      if (jwt) saveToken(jwt);
      setUser(safeUser);

      return { ok: true };
    } catch (error) {
      console.error(error);
      return { ok: false, message: error.message };
    }
  };

  // 🔹 Login Google (recibe el JSON del backend /api/users/google)
  const loginWithToken = (data) => {
    try {
      if (!data || data.status !== "success") {
        return { ok: false, message: data?.message || "Error al iniciar sesión" };
      }

      const jwt = data.token;
      const safeUser = data.payload || data.user || null;

      if (jwt) saveToken(jwt);
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
      // opcional, si tenés endpoint (no es necesario si solo JWT stateless)
      await fetch(`${API_BASE}/api/users/logout`, { method: "GET" }).catch(() => {});
    } finally {
      clearSession();
    }
  };

  // ✅ actualizar perfil (Bearer token)
  const updateProfile = async ({ first_name, last_name }) => {
    try {
      const jwt = token || localStorage.getItem("authToken");
      if (!jwt) throw new Error("Sesión no válida. Volvé a iniciar sesión.");

      const res = await fetch(`${API_BASE}/api/users/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ first_name, last_name }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.status !== "success") {
        throw new Error(data.message || "No se pudo actualizar el perfil");
      }

      setUser(data.payload || data.user || null);
      return { ok: true };
    } catch (error) {
      console.error(error);
      return { ok: false, message: error.message };
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
    refreshUser: fetchCurrentUser,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
