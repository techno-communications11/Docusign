import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

export function MyProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    role: null,
    userId: null,
    loading: true,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/users/me", {
          method: "GET",
          credentials: "include",
        });

        const contentType = response.headers.get("content-type") || "";

        if (!response.ok || !contentType.includes("application/json")) {
          setAuthState({ isAuthenticated: false, role: null, userId: null, loading: false });
          return;
        }

        const data = await response.json();
        setAuthState({
          isAuthenticated: true,
          role: data.role,
          userId: data.id,
          loading: false,
        });
      } catch (error) {
        console.error("Error checking auth:", error);
        setAuthState({ isAuthenticated: false, role: null, userId: null, loading: false });
      }
    };

    checkAuth();
  }, []);

  const addUser = (newUsers) => {
    setUsers(newUsers);
  };

  const updateAuth = (isAuthenticated, role, userId) => {
    setAuthState({ isAuthenticated, role, userId, loading: false });
  };

  const logout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      updateAuth(false, null, null);
    }
  };

  return (
    <AuthContext.Provider value={{ users, addUser, authState, updateAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
