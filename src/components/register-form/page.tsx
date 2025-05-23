"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import Input from "../input/page"; // ajuste o caminho
import { api } from "@/lib/api";
import toast from "react-hot-toast";

const schema = z
  .object({
    name: z.string().min(3, "Nome deve ter ao menos 3 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não conferem",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof schema>;

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(schema),
  });

  const router = useRouter();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await api.post("/api/register", {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Usuário criado com sucesso");
        router.push("/login");
      } else {
        toast.error("Erro ao criar usuário");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error);
    }
  };

  return (
    <>
      {isSubmitting ? (
        <div className="text-center font-semibold text-green-600">Carregando...</div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Input
            name="name"
            label="Nome Completo"
            placeholder="Seu nome completo"
            type="text"
            register={register}
            error={errors.name?.message}
          />

          <Input
            name="email"
            label="Email"
            placeholder="seu@email.com"
            type="email"
            register={register}
            error={errors.email?.message}
          />

          <Input
            name="password"
            label="Senha"
            placeholder="Sua senha"
            type="password"
            register={register}
            error={errors.password?.message}
          />

          <Input
            name="confirmPassword"
            label="Confirmar Senha"
            placeholder="Confirme sua senha"
            type="password"
            register={register}
            error={errors.confirmPassword?.message}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            Criar Conta
          </button>
        </form>
      )}
    </>
  );
}
