"use client";

import { api } from "@/lib/api";
import { Transaction } from "@/types";
import { ArrowDown, ArrowUp, Loader2, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loading from "../loading/page";
import { AxiosError } from "axios";
import ConfirmDialog from "../confirm-dialog/page";

export default function Table({ user, qtd }: { user: any; qtd?: number }) {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpenId, setDialogOpenId] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/api/history`);
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
    setLoading(true);
    try {
      await api.post("/api/reverse", { transactionId });
      const responseGet = await api.get(`/api/history`);
      setData(responseGet?.data?.history || []);
      toast.success("Estorno realizado com sucesso!");
    } catch (error) {
      const err = error as AxiosError<any>;
      const errorMessage =
        err?.response?.data?.error ||
        err?.message ||
        "Erro ao estornar.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setDialogOpenId(null);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <section className="h-auto w-full rounded-lg border border-gray-200 p-6 shadow-lg bg-white">
      <div className="mb-3">
        <h2 className="text-base font-semibold">Transações Recentes</h2>
        <p className="text-xs text-muted-foreground text-gray-400">
          Histórico das suas últimas transações
        </p>
      </div>

      {error && (
        <p className="text-center py-3 text-sm text-red-500">{error}</p>
      )}

      {/* Layout Mobile */}
      <div className="flex flex-col gap-5 overflow-y-auto max-h-96 border border-gray-300 rounded-lg md:hidden px-2 py-3 bg-white shadow-sm">
        {data.length === 0 ? (
          <p className="text-center py-6 text-gray-400 italic font-medium">
            Nenhuma transação encontrada
          </p>
        ) : (
          data.slice(0, qtd ?? data.length).map((item) => (
            <div
              key={item._id}
              className="border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow duration-200 bg-gray-50 hover:bg-white"
            >
              <div className="flex items-center gap-3 mb-4">
                {item.type === "transfer" ? (
                  <span className="capitalize flex gap-2">
                    <ArrowUp className="h-6 w-6 text-red-500" /> Transferência
                  </span>
                ) : item.type === "reversal" ? (
                  <span className="capitalize flex gap-2">
                    <RotateCcw className="h-6 w-6 text-yellow-500" /> Estorno
                  </span>
                ) : (
                  <span className="capitalize flex gap-2">
                    <ArrowDown className="h-6 w-6 text-green-500" /> Depósito
                  </span>
                )}
              </div>

              <p className="mb-1 text-gray-700">
                <strong className="text-gray-900">Descrição:</strong> {item.description}
              </p>
              <p className="mb-1 text-gray-700">
                <strong className="text-gray-900">De:</strong> {item.from || "-"}
              </p>
              <p className="mb-1 text-gray-700">
                <strong className="text-gray-900">Para:</strong> {item.to}
              </p>
              <p className="mb-1 text-gray-700">
                <strong className="text-gray-900">Data:</strong>{" "}
                {new Date(item.createdAt).toLocaleString("pt-BR")}
              </p>
              <p className="mb-3">
                <strong className="text-gray-900">Status:</strong>{" "}
                <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  {item.status}
                </span>
              </p>

              <p className={`text-right font-semibold text-lg ${item.amount < 0 ? "text-red-600" : "text-green-600"}`}>
                {Math.abs(item.amount).toFixed(2)}
              </p>

              {item.type === "transfer" && item.status != "Revertida" && (
                <>
                  <button
                    onClick={() => setDialogOpenId(item._id)}
                    className="cursor-pointer mt-4 w-full flex justify-center items-center gap-2 rounded-md border border-amber-500 bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-200 active:scale-95"
                  >
                    <RotateCcw className="h-5 w-5" />
                    Estornar
                  </button>

                  <ConfirmDialog
                    open={dialogOpenId === item._id}
                    title="Tem certeza?"
                    description="Essa ação é irreversível. O estorno será feito permanentemente."
                    onCancel={() => setDialogOpenId(null)}
                    onConfirm={() => handleReversal(item._id)}
                    loading={loading}
                    confirmText="Sim, estornar"
                    cancelText="Cancelar"
                  />
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Layout Desktop */}
      <div className="hidden max-w-[1200px] md:block overflow-x-auto max-h-96 rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full table-auto border-collapse text-sm font-sans">
          <thead className="bg-green-500 sticky top-0 z-10 shadow-sm">
            <tr>
              {["Tipo", "Descrição", "De", "Para", "Data", "Status", "Valor", "Ações"].map((th) => (
                <th
                  key={th}
                  className="px-4 py-3 text-left font-semibold text-white uppercase tracking-wide"
                >
                  {th}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-gray-400 italic">
                  Nenhuma transação encontrada
                </td>
              </tr>
            ) : (
              data.slice(0, qtd ?? data.length).map((item) => (
                <tr
                  key={item._id}
                  className="border-b border-gray-100 hover:bg-green-50 transition-colors"
                >
                  <td className="px-4 py-3 flex items-center gap-2 text-green-700">
                    {item.type === "transfer" ? (
                      <span className="flex items-center gap-2">
                        <ArrowUp className="h-5 w-5 text-red-500" />
                        Transferência
                      </span>
                    ) : item.type === "reversal" ? (
                      <span className="flex items-center gap-2">
                        <RotateCcw className="h-5 w-5 text-yellow-500" />
                        Estorno
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <ArrowDown className="h-5 w-5 text-green-500" />
                        Depósito
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-gray-700">{item.description}</td>
                  <td className="px-4 py-3 text-gray-600">{item.from || "-"}</td>
                  <td className="px-4 py-3 text-gray-600">{item.to}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {new Date(item.createdAt).toLocaleString("pt-BR")}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      {item.status}
                    </span>
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-semibold ${
                      item.amount < 0 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {Math.abs(item.amount).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {item.type === "transfer" && item.status != "Revertida" && (
                      <>
                        <button
                          onClick={() => setDialogOpenId(item._id)}
                          className="cursor-pointer inline-flex items-center gap-1 rounded-md border border-green-400 bg-green-50 px-3 py-1 text-xs font-medium text-green-700 transition hover:bg-green-100 hover:border-green-500 active:scale-95"
                        >
                          <RotateCcw className="h-4 w-4" />
                          Estornar
                        </button>

                        <ConfirmDialog
                          open={dialogOpenId === item._id}
                          title="Tem certeza?"
                          description="Essa ação é irreversível. O estorno será feito permanentemente."
                          onCancel={() => setDialogOpenId(null)}
                          onConfirm={() => handleReversal(item._id)}
                          loading={loading}
                          confirmText="Sim, estornar"
                          cancelText="Cancelar"
                        />
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
