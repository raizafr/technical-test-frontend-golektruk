"use client";

import { getToken } from "@/app/utils/auth";
import { AuthContextType, useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const pathName = usePathname();
  const { user } = useAuth() as AuthContextType;

  const { logout } = useAuth() as AuthContextType;

  return (
    <nav className="navbar bg-base-100 container mx-auto px-10 fixed top-0 left-0 right-0">
      <div className="flex-1">
        <Link href={"/"} className="btn btn-ghost text-xl">
          Golektruk
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            {pathName === "/register" && <Link href={"/login"}>Login</Link>}
          </li>
          <li>
            {pathName === "/login" && <Link href={"/register"}>Register</Link>}
          </li>
          <li>{pathName === "/" && <button>{user?.name}</button>}</li>
          <li>
            {pathName === "/" && <button onClick={logout}>Logout</button>}
          </li>
        </ul>
      </div>
    </nav>
  );
}
