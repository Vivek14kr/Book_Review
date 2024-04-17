import Signup from '@/components/SignUp'
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/router";


function signup() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is authenticated and loading is false, redirect to home page
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading]);
  return (
    <Signup/>
  )
}

export default signup