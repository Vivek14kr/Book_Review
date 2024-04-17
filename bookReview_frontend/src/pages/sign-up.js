import Signup from '@/components/SignUp'
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/router";


function signup() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading]);
  return (
    <Signup/>
  )
}

export default signup