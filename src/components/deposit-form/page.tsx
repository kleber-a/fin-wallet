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

import { depositAction } from "@/app/actions";

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

    const formData = new FormData();
    formData.append("email", user.email);
    formData.append("amount", String(data.amount));
    formData.append("description", data.description ?? "");

    try {
      const result = await depositAction(formData);
      setIsLoading(true);

      if (result.success) {
        toast.success("Depósito efetuado!");
        reset();
        router.push("/dashboard");
      } else {
        toast.error("Não foi possível fazer o depósito");
      }
    } catch (error) {
      toast.error("Ocorreu um erro ao tentar depositar.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-[100px] min-w-[320px] sm:w-[400px] max-w-md mx-auto 
        rounded-lg
        border border-gray-200 
        p-6 shadow-lg 
        bg-white
      "
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
        className={`w-full ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          } text-white py-2 rounded transition`}
      >
        {isLoading ? "Processando..." : "Depositar"}
      </button>
    </form>
  );
}
