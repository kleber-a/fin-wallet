"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { signOut } from "next-auth/react";
import Input from "@/components/input/page";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { getUser } from "@/services/userService";
import { FormData, User } from "@/types";
import ConfirmDialog from "../confirm-dialog/page";


export default function SettingsForm() {
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorGlobal, setErrorGlobal] = useState("");
    const [myUser, setMyUser] = useState<User | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        defaultValues: { name: myUser?.name },
    });

    useEffect(() => {
        const getUsers = async () => {
            try {
                setLoading(true);
                const UsersData = await getUser("");
                setMyUser(UsersData?.user);

                reset({ name: UsersData?.user?.name });
            } catch {
                toast.error("Erro ao carregar usuário");
            } finally {
                setLoading(false);
            }
        };

        getUsers();
    }, [reset]);

    async function onSubmit(data: FormData) {
        setErrorGlobal("");
        setLoading(true);
        try {
            await api.put("/api/user", { name: data.name });
            toast.success("Nome atualizado com sucesso!");
            reset({ name: data.name });
        } catch {
            toast.error("Erro ao atualizar o nome.");
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteAccount() {
        setErrorGlobal("");
        setLoading(true);
        try {
            await api.delete("/api/user");
            signOut();
            toast.success("Conta deletada com sucesso")
        } catch {
            setErrorGlobal("Erro ao excluir a conta.");
            setLoading(false);
            setOpenDialog(false);
            toast.error("Error ao deletar conta")
        }
    }

    function logOut() {
        signOut();
    }

    return (
        <div className="space-y-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <h2 className="text-lg font-medium">Alterar Nome</h2>
                <Input
                    name="name"
                    placeholder="Digite seu nome"
                    type="text"
                    label="Nome"
                    register={register}
                    rules={{
                        required: "O nome é obrigatório",
                        minLength: {
                            value: 3,
                            message: "O nome precisa ter no mínimo 3 caracteres",
                        },
                    }}
                    error={errors.name?.message}
                />

                {errorGlobal && <p className="text-sm text-red-600">{errorGlobal}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 rounded text-white transition ${loading
                            ? "bg-green-400 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700 cursor-pointer"
                        }`}
                >
                    Salvar
                </button>
            </form>

            <hr />

            <div className="space-y-2">
                <h2 className="text-lg font-medium">Sessão</h2>
                <button
                    onClick={logOut}
                    className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100 transition cursor-pointer"
                >
                    Sair da Conta
                </button>
            </div>

            <hr />

            <div className="space-y-2">
                <h2 className="text-lg font-medium text-red-600">Excluir Conta</h2>
                <p className="text-sm text-gray-600">
                    Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta e todos os dados relacionados.
                </p>

                <button
                    onClick={() => setOpenDialog(true)}
                    className={`bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition ${loading ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                        }`}
                    disabled={loading}
                >
                    Excluir Conta
                </button>

              <ConfirmDialog
                open={openDialog}
                title="Tem certeza?"
                description="Essa ação é irreversível. Todos os seus dados serão excluídos permanentemente."
                onCancel={() => setOpenDialog(false)}
                onConfirm={handleDeleteAccount}
                loading={loading}
                confirmText="Sim, excluir conta"
                cancelText="Cancelar"
                />
            </div>
        </div>
    );
}
