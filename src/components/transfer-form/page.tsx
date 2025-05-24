// "use client"
// import { useEffect, useState } from "react";
// import { z } from "zod";
// import Input from "../input/page";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { getUser } from "@/services/userService";
// import { api } from "@/lib/api";
// import toast from "react-hot-toast";
// import Loading from "../loading/page";
// import { User } from '@/types/index'
// import Select from "../select/page";


// export const createTransferSchema = (saldoDisponivel: number) =>
//     z.object({
//         destinatario: z.string().min(1, "Selecione um destinatário"),
//         valor: z
//             .string()
//             .refine(val => {
//                 const n = Number(val.replace(",", "."));
//                 return !isNaN(n) && n > 0;
//             }, "Valor deve ser um número positivo")
//             .refine(val => {
//                 const n = Number(val.replace(",", "."));
//                 return n <= saldoDisponivel;
//             }, "Saldo insuficiente"),
//         descricao: z
//             .string()
//             .max(100, "Descrição pode ter no máximo 100 caracteres")
//             .optional(),
//     });

// const transferSchema = createTransferSchema(0);

// type TransferFormData = z.infer<typeof transferSchema>;

// export default function TransferForm({ user }: { user: any }) {

//     const [myUser, setMyUser] = useState<User | null>(null)
//     const [otherUsers, setOtherUsers] = useState<User[]>([])
//     const [loading, setLoading] = useState<boolean>(true);

//     useEffect(() => {
//         const getUsers = async () => {
//             try {

//                 setLoading(true);
//                 const UsersData = await getUser(user.email);
//                 setMyUser(UsersData?.user)
//                 setOtherUsers(UsersData?.users)

//                 setLoading(false);
//             } catch (error) {
//                 toast.error("Erro ao carregar usuários");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         getUsers();
//     }, [])

//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//         reset
//     } = useForm<TransferFormData>({
//         resolver: zodResolver(createTransferSchema(myUser?.wallet ?? 0)),
//         mode: "onBlur",
//     });

//     const onSubmit = async (data: TransferFormData) => {
//         toast(`Transferindo R$ ${data.valor} para ${data.destinatario} ${data.descricao ? `"${data.descricao}"` : ""}`);

//         setLoading(true);
//         try {
//             await api.post("/api/transfer", {
//                 toEmail: data.destinatario,
//                 amount: data.valor,
//                 description: data.descricao,
//             });


//             const updatedUserResponse = await getUser(user.email);
//             setMyUser(updatedUserResponse?.user);

//             toast.success('Transferência realizada')


//             reset();
//         } catch (error) {
//             toast.success('Ocorreu um erro ao realizar transferência')
//         } finally {
//             setLoading(false);
//         }

//     };

//     if (loading) {
//         return (
//             <Loading />
//         );
//     }

//     return (
//         <form
//             onSubmit={handleSubmit(onSubmit)}
//             className="w-[100px] min-w-[320px] sm:w-[400px] max-w-md mx-auto
//                 rounded-lg /* Bordas mais suaves: de md para lg */
//                 border border-gray-200 /* Borda fina e sutil */
//                 p-6 shadow-lg /* Sombra mais destacada: de md para lg */
//                 bg-white
//             "
//         >
//             <Select
//                 label="Destinatário"
//                 name="destinatario"
//                 options={otherUsers.map((d) => ({ value: d.email, label: d.email }))}
//                 register={register}
//                 error={errors.destinatario?.message}
//                 rules={{ required: true }}
//             />
//             <Input
//                 label="Valor da Transferência (R$)"
//                 type="text"
//                 placeholder="0,00"
//                 name="valor"
//                 register={register}
//                 error={errors.valor?.message}
//                 rules={{ required: true }}
//             />

//             <Input
//                 label="Descrição (opcional)"
//                 type="text"
//                 placeholder="Descrição da transferência"
//                 name="descricao"
//                 register={register}
//                 error={errors.descricao?.message}
//                 rules={{ maxLength: 100 }}
//             />

//             <button
//                 type="submit"
//                 className="w-full rounded bg-green-600 py-2 font-semibold text-white hover:bg-green-700 transition"
//             >
//                 Transferir
//             </button>

//             <p className="mt-4 text-center text-gray-600">
//                 Saldo Disponível:{" "}
//                 <span className="font-bold text-green-700">
//                     R$ {myUser?.wallet.toFixed(2).replace(".", ",")}
//                 </span>
//             </p>
//         </form>
//     );
// }



"use client"
import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getUser } from "@/services/userService";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import Loading from "../loading/page";
import { User } from '@/types/index'
import Select from "../select/page";
import Input from "../input/page";

export const createTransferSchema = (saldoDisponivel: number) =>
    z.object({
        destinatario: z.string().min(1, "Selecione um destinatário"),
        valor: z
            .number({
                invalid_type_error: "Valor deve ser um número",
                required_error: "Valor é obrigatório",
            })
            .positive("Valor deve ser um número positivo")
            .max(saldoDisponivel, "Saldo insuficiente"),
        descricao: z
            .string()
            .max(100, "Descrição pode ter no máximo 100 caracteres")
            .optional(),
    });

type TransferFormData = z.infer<ReturnType<typeof createTransferSchema>>;

export default function TransferForm({ user }: { user: any }) {
    const [myUser, setMyUser] = useState<User | null>(null);
    const [otherUsers, setOtherUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const getUsers = async () => {
            try {
                setLoading(true);
                const UsersData = await getUser(user.email);
                setMyUser(UsersData?.user);
                setOtherUsers(UsersData?.users);
            } catch (error) {
                toast.error("Erro ao carregar usuários");
            } finally {
                setLoading(false);
            }
        };
        getUsers();
    }, [user.email]);

    const transferSchema = createTransferSchema(myUser?.wallet ?? 0);

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<TransferFormData>({
        resolver: zodResolver(transferSchema),
        mode: "onBlur",
        defaultValues: {
            valor: 0,
            destinatario: "",
            descricao: "",
        },
    });

    const formatMoney = (value: number) => {
        return value.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const parseMoney = (value: string) => {
        if (!value) return 0;
        const onlyNumbers = value.replace(/\D/g, "");
        return parseInt(onlyNumbers, 10) / 100;
    };

    const onSubmit = async (data: TransferFormData) => {
        toast(`Transferindo R$ ${formatMoney(data.valor)} para ${data.destinatario} ${data.descricao ? `"${data.descricao}"` : ""}`);

        setLoading(true);
        try {
            await api.post("/api/transfer", {
                toEmail: data.destinatario,
                amount: data.valor,
                description: data.descricao,
            });

            const updatedUserResponse = await getUser(user.email);
            setMyUser(updatedUserResponse?.user);

            toast.success('Transferência realizada');

            reset();
        } catch (error) {
            toast.error('Ocorreu um erro ao realizar transferência');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-[100px] min-w-[320px] sm:w-[400px] max-w-md mx-auto
                rounded-lg
                border border-gray-200
                p-6 shadow-lg
                bg-white"
        >
            <Select
                label="Destinatário"
                name="destinatario"
                options={otherUsers.map((d) => ({ value: d.email, label: d.email }))}
                register={register}
                error={errors.destinatario?.message}
                rules={{ required: true }}
            />

            <Controller
                name="valor"
                control={control}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <div className="mb-4">
                        <label
                            htmlFor="valor"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Valor da Transferência (R$)
                        </label>
                        <input
                            id="valor"
                            type="text"
                            placeholder="0,00"
                            value={formatMoney(value)}
                            onChange={(e) => {
                                const parsed = parseMoney(e.target.value);
                                onChange(parsed);
                            }}
                            className={`w-full h-11 px-3 py-2
                                border border-gray-200 rounded-lg
                                shadow-sm 
                                text-gray-900 placeholder-gray-400
                                focus:outline-none 
                                focus:border-green-500 
                                focus:ring-2 focus:ring-green-200
                                transition-all duration-300 ease-in-out
                                ${error ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""}`}
                            aria-invalid={error ? "true" : "false"}
                        />
                        <p className="text-red-600 text-xs min-h-[0.25rem]">
                            {error?.message || "\u00A0"}
                        </p>
                    </div>
                )}
            />

            <Input
                label="Descrição (opcional)"
                type="text"
                placeholder="Descrição da transferência"
                name="descricao"
                register={register}
                error={errors.descricao?.message}
                rules={{ maxLength: 100 }}
            />

            <button
                type="submit"
                className="w-full rounded bg-green-600 py-2 font-semibold text-white hover:bg-green-700 transition"
            >
                Transferir
            </button>

            <p className="mt-4 text-center text-gray-600">
                Saldo Disponível:{" "}
                <span className="font-bold text-green-700">
                    R$ {myUser?.wallet.toFixed(2).replace(".", ",")}
                </span>
            </p>
        </form>
    );
}
