"use client";

import Button from "@/components/Button";
import { login, me } from "@/service/api";
import Link from "next/link";
import { useState } from "react";
import { setToken } from "../utils/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Login() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  async function handleSubmit(e: any) {
    e.preventDefault();
    setIsLoading(true);
    const email = e.target[0].value;
    const password = e.target[1].value;

    if (!email) {
      toast.error("Email tidak boleh kosong");
      return setIsLoading(false);
    }
    if (!password) {
      toast.error("Password tidak boleh kosong");
      return setIsLoading(false);
    }
    const responseLogin = await login({ username: email, password: password });
    if (responseLogin?.access_token) {
      setToken(responseLogin.access_token);
      toast.success("Login Berhasil");
      router.push("/");
    }
    if (responseLogin?.detail?.code) {
      toast.error(responseLogin.detail.code);
      return setIsLoading(false);
    }
    setIsLoading(false);
  }

  return (
    <section className="container mx-auto px-5 md:px-10 lg:px-20 flex justify-center items-center min-h-screen">
      <form
        className="bg-blue-300 p-5 rounded-lg w-full md:w-1/2 lg:w-1/3 flex justify-center"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="w-full space-y-3">
          <div>
            <h1 className="text-center text-2xl font-bold">Login</h1>
          </div>
          <div className="">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Email</span>
              </div>
              <input
                type="email"
                placeholder="Example@mail.com"
                className="input input-bordered w-full"
              />
            </label>
          </div>
          <div>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Password</span>
              </div>
              <input
                type="password"
                placeholder="Password"
                className="input input-bordered w-full"
              />
            </label>
          </div>
          <Button isLoading={isLoading}>Masuk</Button>
          <p className="text-xs text-center">
            Belum punya akun?{" "}
            <Link href={"/register"} className="text-secondary">
              register
            </Link>
          </p>
        </div>
      </form>
    </section>
  );
}
