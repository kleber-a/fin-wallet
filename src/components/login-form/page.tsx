// "use client"

// import { getSession, signIn } from "next-auth/react";
// import { useState } from "react";
// import Loading from "../loading/page";
// import toast from "react-hot-toast";
// import { useRouter } from 'next/navigation';


// export default function LoginForm() {
//     const router = useRouter();
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [loading, setLoading] = useState(false);

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setLoading(true);


//         const res = await signIn('credentials', {
//             redirect: false,
//             email,
//             password,
//         });
//         if (res?.error) {
//             toast.error('Email ou senha inválidos');
//             setLoading(false);
//         } else {
//             await getSession();
//             toast.success('Sucesso')
//             router.push('/dashboard')
//             setLoading(false);
//         }
//     };

//     if (loading) {
//         return (
//             <Loading />
//         )
//     }


//     return (
//         <form className="space-y-4" onSubmit={handleSubmit}>
//             <input
//                 className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
//                 type="email"
//                 placeholder="Email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//             />

//             <input
//                 type="password"
//                 placeholder="Senha"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
//             />

//             <button type="submit" className="w-full bg-green-600 hover:bg-green-700 p-1 rounded-md text-white ">
//                 Entrar
//             </button>
//         </form>
//     )
// }


"use client"

import { useForm } from "react-hook-form";
import { getSession, signIn } from "next-auth/react";
import { useState } from "react";
import Loading from "../loading/page";
import toast from "react-hot-toast";
import { useRouter } from 'next/navigation';
import Input from "@/components/input/page"; // caminho correto para seu componente Input

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
