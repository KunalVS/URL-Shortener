import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setUnauthorizedHandler } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => window.sessionStorage.getItem("shortly-token"));

  const login = useCallback((nextToken) => {
    window.sessionStorage.setItem("shortly-token", nextToken);
    setToken(nextToken);
  }, []);

  const logout = useCallback(() => {
    window.sessionStorage.removeItem("shortly-token");
    setToken(null);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      logout();
      navigate("/login", {
        replace: true,
        state: { message: "Your session expired. Please log in again." },
      });
    });
    return () => setUnauthorizedHandler(undefined);
  }, [logout, navigate]);

  const value = useMemo(
    () => ({ token, isAuthenticated: Boolean(token), login, logout }),
    [token, login, logout],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider.");
  return value;
}
