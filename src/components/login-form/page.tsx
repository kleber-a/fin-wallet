"use client"

import { useForm } from "react-hook-form";
import { getSession, signIn } from "next-auth/react";
import { useState } from "react";
import Loading from "../loading/page";
import toast from "react-hot-toast";
import { useRouter } from 'next/navigation';
import Input from "@/components/input/page";

type FormData = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setLoading(true);

    const res = await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (res?.error) {
      toast.error('Email ou senha inválidos');
      setLoading(false);
    } else {
      await getSession();
      toast.success('Sucesso');
      router.push('/dashboard');
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <Input
        name="email"
        type="email"
        placeholder="Email"
        label="Email"
        register={register}
        rules={{ 
          required: "Email é obrigatório",
          pattern: {
            value: /^\S+@\S+$/i,
            message: "Email inválido"
          }
        }}
        error={errors.email?.message}
      />

      <Input
        name="password"
        type="password"
        placeholder="Senha"
        label="Senha"
        register={register}
        rules={{ required: "Senha é obrigatória" }}
        error={errors.password?.message}
      />

      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 p-1 rounded-md text-white"
      >
        Entrar
      </button>
    </form>
  );
}
