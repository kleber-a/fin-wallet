"use client";

import { api } from "@/lib/api";
import { ArrowDown, ArrowUp, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";


interface Transaction {
  _id: string;
  type: string;
  from: string | null;
  to: string;
  amount: number;
  description: string;
  status: string;
  createdAt: Date;
}

export default function Table({ user, qtd }: { user: any; qtd?: number }) {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/api/history`);
        console.log('response', response)
        setData(response?.data?.history || []);
      } catch (err: any) {
        setError(err.message || "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchHistory();
    }
  }, [user, qtd]);

  const handleReversal = async (transactionId: string) => {
    const confirm = window.confirm("Tem certeza que deseja estornar essa transação?");
    if (!confirm) return;
    setLoading(true);
    console.log('transactionId', transactionId)
    try {
      const response = await api.post("/api/reverse", {
        transactionId: transactionId
      }
      );
      const responseGet = await api.get(`/api/history`);
      console.log('response', response)
      setData(responseGet?.data?.history || []);
      console.log('aqui')
      toast.success("Estorno realizado com sucesso!");

    } catch (error) {
      console.error("Erro ao estornar:", error);
      toast.error("Erro ao estornar.");
    } finally {
       setLoading(false);
    }
    console.log('loading',loading)
  };

  return (
      <section className="rounded-md border border-amber-400 bg-white p-4 shadow-sm h-auto">
        <div className="mb-3">
          <h2 className="text-base font-semibold">Transações Recentes</h2>
          <p className="text-xs text-muted-foreground text-gray-400">
            Histórico das suas últimas transações
          </p>
        </div>

        {loading && <p className="text-center py-3 text-sm">Carregando histórico...</p>}
        {error && <p className="text-center py-3 text-sm text-red-500">{error}</p>}

        {!loading && !error && (
       <div className="overflow-x-auto overflow-y-auto max-h-96 border border-gray-200 rounded">
        <table className="w-full table-auto border-collapse text-sm">
            <thead className="bg-white sticky top-0 z-10">
              <tr>
                <th className="px-2 py-2 text-left">Tipo</th>
                <th className="px-2 py-2 text-left">Descrição</th>
                <th className="px-2 py-2 text-left">De</th>
                <th className="px-2 py-2 text-left">Para</th>
                <th className="px-2 py-2 text-left">Data</th>
                <th className="px-2 py-2 text-left">Status</th>
                <th className="px-2 py-2 text-right">Valor</th>
                <th className="px-2 py-2 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-3 text-gray-500">
                      Nenhuma transação encontrada
                    </td>
                  </tr>
                ) : (
                  data.slice(0, qtd ?? data.length).map(item => (
                    <tr
                      key={item._id}
                      className="border-b last:border-b-0 hover:bg-gray-50"
                    >
                      <td className="px-2 py-2 flex items-center gap-1">
                        {item.type === "transfer" ? (
                          <ArrowUp className="h-3 w-3 text-red-500" />
                        ) : item.type === "reversal" ? (
                          <RotateCcw className="h-3 w-3 text-yellow-500" />
                        ) : (
                          <ArrowDown className="h-3 w-3 text-green-500" />
                        )}
                        <span className="capitalize">{item.type}</span>
                      </td>

                      <td className="px-2 py-2">{item.description}</td>

                      <td className="px-2 py-2">{item.from || "-"}</td>

                      <td className="px-2 py-2">{item.to}</td>

                      <td className="px-2 py-2">
                        {new Date(item.createdAt).toLocaleString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })}
                      </td>

                      <td className="px-2 py-2">
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-600">
                          {item.status}
                        </span>
                      </td>

                      <td className="px-2 py-2 text-right font-medium">
                        {item.amount < 0 ? (
                          <span className="text-red-600">
                            R$ {Math.abs(item.amount).toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-green-600">
                            R$ {item.amount.toFixed(2)}
                          </span>
                        )}
                      </td>

                      <td className="px-2 py-2 text-center">
                        {item.type === "transfer" && (
                          <button
                            onClick={() => handleReversal(item._id)}
                            className="flex items-center gap-1 rounded-md border border-gray-300 px-2 py-1 text-[10px] hover:bg-gray-100 dark:border-gray-700"
                          >
                            <RotateCcw className="h-3 w-3" />
                            Estornar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

  );
}
