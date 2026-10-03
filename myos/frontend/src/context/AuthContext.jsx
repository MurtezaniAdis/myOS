import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await fetch("http://localhost:3100/auth/check", {
        credentials: "include",
      });
      const data = await res.json();

      if (res.ok && data.loggedIn) {
        setUser(data.user);
        return data.user;
      }
      setUser(null);
      return null;
    } catch (error) {
      setUser(null);
      return null;
    }
  };

  const logout = async () => {
    try {
      await fetch("http://localhost:3100/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
    }
  };

  const refreshAuth = async () => {
    return await checkAuth();
  };

  useEffect(() => {
    checkAuth().finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
