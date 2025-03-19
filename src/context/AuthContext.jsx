import { createContext, useContext, useState, useEffect } from "react";
import AhiskaApi from "../api/AhiskaApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      AhiskaApi.token = token;
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  const login = (user, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    AhiskaApi.token = token;
    setCurrentUser({ ...user });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    AhiskaApi.token = null;
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, setCurrentUser, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
