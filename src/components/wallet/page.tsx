"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { getUser } from "@/lib/api";


function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function Wallet({ user }: { user: any }) {
  const [myUser, setMyUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const requestWallet = async () => {
      try {
        setLoading(true);
        const walletData = await getUser();
        setMyUser(walletData?.user);
        setLoading(false);
      } catch (error) {
        setMyUser({ wallet: null });
      } finally {
        setLoading(false);
      }

    };

    requestWallet();
  }, [user.email]);

  return (
    <section className="
        w-full 
        md:w-auto
        rounded-lg
        border border-gray-200 
        p-6 shadow-lg 
        bg-white">
      <h3 className="text-sm font-medium text-black">Saldo Disponível</h3>

      <div className="mt-2 text-4xl font-bold text-green-600 min-h-[48px] flex items-center justify-center">
        {loading ? (
          <Loader2 data-testid="loader-icon" className="animate-spin text-amber-400 w-8 h-8" />
        ) : myUser?.wallet != null ? (
          `${formatCurrency(myUser.wallet)}`
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
