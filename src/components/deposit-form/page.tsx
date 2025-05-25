"use client";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import Input from "../input/page";
import { depositAction } from "@/app/actions";

const schema = z.object({
  amount: z
    .string()
    .min(1, "O valor é obrigatório.")
    .refine(
      (val) => {
        const clean = val.replace(/\./g, "").replace(",", ".");
        return !isNaN(Number(clean)) && Number(clean) > 0;
      },
      { message: "Informe um valor válido maior que zero." }
    ),
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
    control,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: "",
      description: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    const amountNumber = Number(
      data.amount.replace(/\./g, "").replace(",", ".")
    );

    const formData = new FormData();
    formData.append("email", user.email);
    formData.append("amount", String(amountNumber));
    formData.append("description", data.description ?? "");

    try {
      const result = await depositAction(formData);

      if (result.success) {
        toast.success("Depósito efetuado!");
        reset();
        router.push("/dashboard");
      } else {
        toast.error("Não foi possível fazer o depósito");
      }
    } catch (error) {
      toast.error("Ocorreu um erro ao tentar depositar.");
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
      <Controller
        name="amount"
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <div className="mb-1">
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Valor do depósito (R$)
            </label>
            <input
              id="amount"
              type="text"
              value={value}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/\D/g, "");
                const numericValue = (parseInt(rawValue || "0") / 100).toFixed(
                  2
                );
                const formattedValue = numericValue
                  .replace(".", ",")
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                onChange(formattedValue);
              }}
              placeholder="Digite o valor"
              className={`w-full h-11 px-3 py-2
                border border-gray-200 rounded-lg
                shadow-sm 
                text-gray-900 placeholder-gray-400
                focus:outline-none 
                focus:border-green-500 
                focus:ring-2 focus:ring-green-200
                transition-all duration-300 ease-in-out
                ${
                  error
                    ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                    : ""
                } `}
              aria-invalid={error ? "true" : "false"}
            />
            <p
              id="amount-error"
              className="text-red-600 text-xs min-h-[0.25rem]"
            >
              {error?.message || "\u00A0"}
            </p>
          </div>
        )}
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
        className={`w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition`}
      >
        Depositar
      </button>
    </form>
  );
}
