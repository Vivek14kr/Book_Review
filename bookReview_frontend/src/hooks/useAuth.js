import { useState, useEffect, createContext, useContext } from "react";
import { useRouter } from "next/router";

// Create a context to manage user authentication state
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = parseJwt(token);
      setUser({ username: decodedToken.username });
    }
  }, []);

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };

const login = async (credentials) => {
  setLoading(true);
  try {
    const res = await fetch("http://localhost:3000/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("token", data.token);
      setUser({ username: data.username });
      setLoading(false); // Move setLoading(false) before router.push
      router.push("/"); // Redirect to homepage after successful login
    } else {
      throw new Error(data.message || "Login failed");
    }
  } catch (error) {
    console.error("Login error:", error);
    setLoading(false); // Move setLoading(false) to handle error case
    setError(error.message); // Set error message
  }
};

  const signUp = async (userData) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (res.ok) {
        router.push("/login");
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Signup failed");
      }
    } catch (error) {
      console.error("Sign up error:", error);
    }
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return !!token;
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signUp, logout, isAuthenticated, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to consume the AuthContext
export const useAuth = () => useContext(AuthContext);
