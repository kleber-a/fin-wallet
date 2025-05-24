"use client";

import { Wallet, LogOut, User } from "lucide-react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="px-4 lg:px-6 h-16 flex items-center 
      border border-gray-200 rounded-md 
      shadow-md bg-white">
      
      <Link href="/" className="flex items-center justify-center">
        <Wallet className="h-6 w-6 text-green-600" />
        <span className="ml-2 text-xl font-bold text-gray-800">FinWallet</span>
      </Link>

      <nav className="ml-auto flex items-center gap-4 sm:gap-6">
        {!session ? (
          <>
            <Link
              href="/login"
              className="inline-flex h-9 items-center justify-center 
                rounded-full bg-green-600 px-5 text-sm font-medium 
                text-white shadow-sm transition-all duration-200 
                hover:bg-green-700 hover:shadow-md 
                focus-visible:outline-none focus-visible:ring-2 
                focus-visible:ring-green-500 focus-visible:ring-offset-2
                disabled:pointer-events-none disabled:opacity-50"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="inline-flex h-9 items-center justify-center 
                rounded-full border border-green-600 bg-white px-5 
                text-sm font-medium text-green-600 shadow-sm 
                transition-all duration-200 hover:bg-green-50 hover:shadow-md 
                focus-visible:outline-none focus-visible:ring-2 
                focus-visible:ring-green-500 focus-visible:ring-offset-2 
                disabled:pointer-events-none disabled:opacity-50"
            >
              Cadastrar
            </Link>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {session.user?.email ?? "Usuário"}
              </span>
            </div>
            <button
              onClick={() => signOut()}
              className="cursor-pointer inline-flex items-center gap-1.5 rounded-full 
              px-4 py-1.5 text-sm font-medium text-gray-600 
              hover:bg-red-50 hover:text-red-700 active:scale-95 transition-all duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}