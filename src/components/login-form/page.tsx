"use client"

import { getSession, signIn, useSession } from "next-auth/react";
import { useState } from "react";


export default function LoginForm() {

    const { status, data } = useSession();

   const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // console.warn('submint')

        const res = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });

        console.warn('res',res)
        if (res?.error) {
            console.log('Erro:', res.error);
            alert('Email ou senha inválidos');
        } else {
            console.log('Sucesso', res);
            console.log('test',   email,
            password,);
             await getSession();
            window.location.href = '/dashboard'; // Redirecionar manualmente
        }
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input   
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            />

            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 p-1 rounded-md text-white ">
                Entrar
            </button>
        </form>
    )
}