// useAuth.js
import { useState } from "react";
import { useRouter } from "next/router";
import { signUpApi, loginApi } from "@/api/auth"; // Implement these API functions

export const useAuth = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    try {
      const token = await loginApi(credentials);
      localStorage.setItem("token", token);
      // Fetch user info and set user state
      // setUser(userInfo);
      router.push("/");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const signUp = async (userData) => {
    try {
      await signUpApi(userData);
      router.push("/login");
    } catch (error) {
      console.error("Sign up error:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    // Clear user state
    // setUser(null);
    router.push("/login");
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return !!token;
  };

  return { user, login, signUp, logout, isAuthenticated };
};
