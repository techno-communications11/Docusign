import { useState } from "react";
import { AuthContext } from "./AuthContext";

const AUTH_STORAGE_KEY = "auth_state";

const defaultAuthState = {
  isAuthenticated: false,
  role: null,
  userId: null,
  loading: false,
};

const loadStoredAuthState = () => {
  if (typeof window === "undefined") {
    return defaultAuthState;
  }

  try {
    const storedValue = window.sessionStorage.getItem(AUTH_STORAGE_KEY);

    if (!storedValue) {
      return defaultAuthState;
    }

    const parsedValue = JSON.parse(storedValue);

    return {
      isAuthenticated: Boolean(parsedValue.isAuthenticated),
      role: parsedValue.role ?? null,
      userId: parsedValue.userId ?? null,
      loading: false,
    };
  } catch (error) {
    console.error("Failed to restore auth state:", error);
    return defaultAuthState;
  }
};

export function MyProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [authState, setAuthState] = useState(loadStoredAuthState);

  const persistAuthState = (nextAuthState) => {
    if (typeof window === "undefined") {
      return;
    }

    if (!nextAuthState.isAuthenticated) {
      window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
      return;
    }

    window.sessionStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        isAuthenticated: true,
        role: nextAuthState.role,
        userId: nextAuthState.userId,
      })
    );
  };

  const applyAuthState = (nextAuthState) => {
    setAuthState(nextAuthState);
    persistAuthState(nextAuthState);
  };

  const addUser = (newUsers) => {
    setUsers(newUsers);
  };

  const updateAuth = (isAuthenticated, role, userId) => {
    applyAuthState({ isAuthenticated, role, userId, loading: false });
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
