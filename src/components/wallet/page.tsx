"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { getUser } from "@/services/userService";



export default function Wallet({ user }: { user: any }) {
  const [myUser, setMyUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const requestWallet = async () => {
      try {
        setLoading(true);
        const walletData = await getUser(user.email);
        setMyUser(walletData?.user);
        setLoading(false);
      } catch (error) {
        setMyUser({ wallet: 'Error' })
        setLoading(false);
      }

    };

    requestWallet();
  }, [user.email]);

  return (
    <section className="rounded-md border border-amber-400 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-medium text-black">Saldo Disponível</h3>

      <div className="mt-2 text-4xl font-bold text-green-600 min-h-[48px] flex items-center justify-center">
        {loading ? (
          <Loader2 className="animate-spin text-amber-400 w-8 h-8" />
        ) : myUser?.wallet !== undefined ? (
          `R$ ${myUser.wallet}`
        ) : (
          <span className="text-gray-400 text-base">Nenhum saldo disponível</span>
        )}
      </div>

      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        Atualizado em {new Date().toLocaleDateString("pt-BR")}
      </p>
    </section>
  );
}
