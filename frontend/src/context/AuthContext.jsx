import { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      const payload = JSON.parse(atob(storedToken.split(".")[1]));
      if (payload.exp * 1000 <= Date.now()) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setLoading(false);
        return;
      }
      setToken(storedToken);

      // Try stored user first for instant render
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setLoading(false);
      }

      // Always fetch fresh user data from API
      api
        .get(`/users/${payload.userid}`)
        .then((res) => {
          const freshUser = res.data.data;
          setUser(freshUser);
          localStorage.setItem("user", JSON.stringify(freshUser));
        })
        .catch(() => {
          // If fetch fails but we have stored user, keep it
          if (!storedUser) {
            setUser({ _id: payload.userid, role: payload.role });
          }
        })
        .finally(() => setLoading(false));
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setLoading(false);
    }
  }, []);

  const signIn = (newToken, userData) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await api.post("/auth/sign-out");
    } catch {
      /* ignore */
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    window.location.href = "/sign-in";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        signIn,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
