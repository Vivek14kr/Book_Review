// pages/login.js
import Login from "@/components/Login";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/router";

const LoginPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is authenticated and loading is false, redirect to home page
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading]);

  // Render login component regardless of user status
  return <Login />;
};

export default LoginPage;
