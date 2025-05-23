"use client";

import { api } from "@/lib/api";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../input/page";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// Schema de validação
const schema = z.object({
  amount: z
    .number({ invalid_type_error: "O valor deve ser um número válido." })
    .min(0.01, "O valor do depósito deve ser maior que zero.")
    .max(1000000, "O valor máximo de depósito é R$ 1.000.000,00."),
  description: z
    .string()
    .max(200, "A descrição deve ter no máximo 200 caracteres.")
    .optional(),
});

type FormData = z.infer<typeof schema>;

export default function DepositForm({ user }: { user: any }) {
    const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: 0,
      description: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await api.post("/api/deposit", {
        email: user.email,
        amount: data.amount,
        description: data.description,
      });

      toast.success("Depósito efetuado!");
      reset();
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro ao fazer depósito:", error);
      toast.error("Ocorreu um erro ao tentar depositar.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto rounded-md border p-6 shadow-md bg-white"
    >
      <Input
        label="Valor do depósito (R$)"
        type="number"
        placeholder="Digite o valor"
        name="amount"
        register={register}
        rules={{ valueAsNumber: true }}
        error={errors.amount?.message}
      />

      <Input
        label="Descrição (opcional)"
        type="text"
        placeholder="Digite uma descrição"
        name="description"
        register={register}
        error={errors.description?.message}
      />

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full ${
          isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
        } text-white py-2 rounded transition`}
      >
        {isLoading ? "Processando..." : "Depositar"}
      </button>
    </form>
  );
}
