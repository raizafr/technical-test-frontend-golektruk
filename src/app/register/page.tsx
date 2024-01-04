"use client";

import Link from "next/link";
import usePickImage from "@/hooks/usePickImage";
import Image from "next/image";
import { useState } from "react";
import Button from "@/components/Button";
import { toast } from 'react-toastify';
import { register, uploadImage } from "@/service/api";
import { useRouter } from "next/navigation";

export default function Register() {
  const { fileImage, preview, onSelectFile } = usePickImage();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  async function handleSubmit(e: any) {
    e.preventDefault();
    const email = e.target[1].value;
    const name = e.target[2].value;
    const phoneNumber = e.target[3].value;
    const age = e.target[4].value;
    const password = e.target[5].value;
    const pattern = /^628[0-9]+$/;
    setIsLoading(true);

    if (!fileImage) {
      setIsLoading(false);
      return toast.error("Belum ada gambar yang dipilih");
    }
    if (!email || !name || !phoneNumber || !age || !password) {
      setIsLoading(false);
      return toast.error("Field masih kosong");
    }

    if (!pattern.test(phoneNumber) || phoneNumber.length < 10) {
      setIsLoading(false);
      return toast.error("Nomor telepon tidak valid, harus menggunakan 628 dan minimal 9 digit");
    }

    if (age < 18) {
      setIsLoading(false);
      return toast.error("Gagal mendaftar, harus berusia 18 tahun keatas");
    }

    const responseUploadImage = await uploadImage(fileImage);
    if (responseUploadImage) {
      const responseRegister = await register({
        email: email,
        name: name,
        phone: phoneNumber,
        age: parseInt(age),
        password: password,
        photos: [responseUploadImage],
      });
      console.log(responseRegister)
      if(responseRegister?.detail?.code){
        setIsLoading(false)
        return toast.error(responseRegister.detail.code)
      }
      toast.success('Register Berhasil')
      router.push('/login') 

    }
    setIsLoading(false);
  }

  return (
    <section className="container mx-auto px-5 md:px-10 lg:px-20 flex justify-center items-center min-h-screen my-20 lg:my-20 md:my-10">
      <form
        className="bg-blue-300 p-5 rounded-lg w-full md:w-1/2 lg:w-1/3 flex justify-center"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="w-full space-y-3">
          <div>
            <h1 className="text-center text-2xl font-bold">Register</h1>
          </div>
          <div>
            <label>
              <input
                type="file"
                accept="image/*"
                onChange={onSelectFile}
                className="hidden"
                name="image"
              />
              <div className="flex justify-center">
                <div
                  className={`${
                    fileImage ? "hidden" : "block"
                  } w-28 h-28 bg-base-300 rounded-full flex justify-center items-center cursor-pointer`}
                >
                  <div className="text-xs">pilih foto</div>
                </div>
                {fileImage && (
                  <Image
                    src={preview}
                    width={120}
                    height={120}
                    alt="foto-profile"
                    className={`w-28 h-28 bg-base-300 rounded-full flex justify-center items-center cursor-pointer`}
                  />
                )}
              </div>
            </label>
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
                name="email"
              />
            </label>
          </div>
          <div className="">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Name</span>
              </div>
              <input
                type="text"
                placeholder="Name"
                className="input input-bordered w-full"
                name="name"
              />
            </label>
          </div>
          <div className="">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Phone Number</span>
              </div>
              <input
                type="number"
                placeholder="Phone Number"
                className="input input-bordered w-full"
                name="phoneNumber"
              />
            </label>
          </div>
          <div className="">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Umur</span>
              </div>
              <input
                type="number"
                placeholder="Umur"
                className="input input-bordered w-full"
                name="age"
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
                name="password"
              />
            </label>
          </div>
          <Button isLoading={isLoading}>Register</Button>
          <p className="text-xs text-center">
            Sudah punya akun?{" "}
            <Link href={"/login"} className="text-secondary">
              login
            </Link>
          </p>
        </div>
      </form>
    </section>
  );
}
