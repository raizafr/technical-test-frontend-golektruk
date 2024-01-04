"use client";

import clearCookie, { getToken } from "@/app/utils/auth";
import { logoutUser, me } from "@/service/api";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface UserType {
  age: string;
  email: string;
  name: string;
  phone: string;
  photos: string[];
  token: string;
}

export interface AuthContextType {
  user: UserType | null;
  logout: () => void;
  getMe: () => void;
  isLogin: boolean;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | {}>({});

function AuthProvider({ children }: any) {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const token = getToken();

  const getMe = useCallback(async () => {
    if (token) {
      try {
        const response = await me(token);
        if (response) {
          setUser(response);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
  }, [token]);

  useEffect(() => {
    getMe();
  }, [getMe]);

  async function logout() {
    if (token) {
      const response = await logoutUser(token);
      if (response) {
        setUser(null);
        clearCookie();
        router.refresh();
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        getMe,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
