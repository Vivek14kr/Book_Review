// Navbar.js
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <a className="text-white font-semibold text-xl">Bookstore</a>
        </Link>
        <div>
          {user ? (
            <>
              <span className="text-white mr-4">{user.username}</span>
              <button onClick={logout} className="text-white underline">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <a className="text-white mr-4">Login</a>
              </Link>
              <Link href="/signup">
                <a className="text-white">Sign Up</a>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
