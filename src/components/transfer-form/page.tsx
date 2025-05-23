"use client"
import { useEffect, useState } from "react";
import { z } from "zod";
import Input from "../input/page";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getUser } from "@/services/userService";
import { api } from "@/lib/api";
import { SplinePointerIcon } from "lucide-react";
import toast from "react-hot-toast";

export const createTransferSchema = (saldoDisponivel: number) =>
    z.object({
        destinatario: z.string().min(1, "Selecione um destinatário"),
        valor: z
            .string()
            .refine(val => {
                const n = Number(val.replace(",", "."));
                return !isNaN(n) && n > 0;
            }, "Valor deve ser um número positivo")
            .refine(val => {
                const n = Number(val.replace(",", "."));
                return n <= saldoDisponivel;
            }, "Saldo insuficiente"),
        descricao: z
            .string()
            .max(100, "Descrição pode ter no máximo 100 caracteres")
            .optional(),
    });

const transferSchema = createTransferSchema(0);

type TransferFormData = z.infer<typeof transferSchema>;


interface User {
    email: string;
    name: string;
    wallet: number;
    _id: string;
}

export default function TransferForm({ user }: { user: any }) {

    const [myUser, setMyUser] = useState<User | null>(null)
    const [otherUsers, setOtherUsers] = useState<User[]>([])
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const getUsers = async () => {
            try {

                setLoading(true);
                const UsersData = await getUser(user.email);
                setMyUser(UsersData?.user)
                setOtherUsers(UsersData?.users)

                setLoading(false);
            } catch (error) {
                toast.error("Erro ao carregar usuários");
            } finally {
                setLoading(false);
            }
        };

        getUsers();
    }, [])

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<TransferFormData>({
        resolver: zodResolver(createTransferSchema(myUser?.wallet ?? 0)),
        mode: "onBlur",
    });

    const onSubmit = async (data: TransferFormData) => {
        toast(`Transferindo R$ ${data.valor} para ${data.destinatario}${data.descricao}`);

        setLoading(true);
        try {
            await api.post("/api/transfer", {
                toEmail: data.destinatario,
                amount: data.valor,
                description: data.descricao,
            });


            // Busca o usuário atualizado
            const updatedUserResponse = await getUser(user.email);
            setMyUser(updatedUserResponse?.user);

            toast.success('Transferência realizada')


            reset();
        } catch (error) {
            toast.success('Ocorreu um erro ao realizar transferência')
        } finally {
            setLoading(false);
        }

    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-48">
                <SplinePointerIcon size="large" />
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-md mx-auto rounded-md border p-6 shadow-md bg-white"
        >
            {/* Destinatário */}
            <label htmlFor="destinatario" className="block mb-2 font-medium">
                Destinatário
            </label>
            <select
                id="destinatario"
                {...register("destinatario")}
                className={`w-full rounded border px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none pr-8 relative ${errors.destinatario ? "border-red-500" : ""
                    }`}
                style={{
                    backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='gray' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.5rem center',
                    backgroundSize: '1rem'
                }}
                defaultValue=""
            >
                <option value="" disabled>
                    Selecione o destinatário
                </option>
                {otherUsers && otherUsers.map((d, index) => (
                    <option key={index} value={d.email}>
                        {d.email}
                    </option>
                ))}
            </select>
            {errors.destinatario && (
                <p className="text-red-500 text-sm mb-4">{errors.destinatario.message}</p>
            )}

            {/* Valor da Transferência */}
            <Input
                label="Valor da Transferência (R$)"
                type="text"
                placeholder="0,00"
                name="valor"
                register={register}
                error={errors.valor?.message}
                rules={{ required: true }}
            />

            {/* Descrição (opcional) */}
            <Input
                label="Descrição (opcional)"
                type="text"
                placeholder="Descrição da transferência"
                name="descricao"
                register={register}
                error={errors.descricao?.message}
                rules={{ maxLength: 100 }}
            />

            {/* Botão Transferir */}
            <button
                type="submit"
                className="w-full rounded bg-green-600 py-2 font-semibold text-white hover:bg-green-700 transition"
            >
                Transferir
            </button>

            {/* Saldo Disponível */}
            <p className="mt-4 text-center text-gray-600">
                Saldo Disponível:{" "}
                <span className="font-bold text-green-700">
                    R$ {myUser?.wallet.toFixed(2).replace(".", ",")}
                </span>
            </p>
        </form>
    );
}