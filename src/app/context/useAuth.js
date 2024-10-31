import React, { createContext, useContext, useState, useEffect } from "react";
import { setCookie, destroyCookie, parseCookies } from "nookies";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from cookie on mount
  useEffect(() => {
    const cookies = parseCookies(); // Retrieve all cookies
    const userData = cookies.user; // Access the user cookie directly
    if (userData) {
      setUser(JSON.parse(userData)); // Set user state
    }
  }, []);

  const login = (userData) => {
    setUser(userData); // Set user data after successful login
    setCookie(null, "user", JSON.stringify(userData), { path: "/" }); // Save to cookie
  };

  const logout = () => {
    setUser(null); // Clear user data on logout
    destroyCookie(null, "user"); // Remove cookie
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
