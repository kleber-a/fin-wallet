import { ArrowDown, ArrowUp, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function Table() {
  const data = [
    {
      id: 1,
      tipo: "recebimento",
      descricao: "Depósito bancário",
      data: "20/05/2025",
      status: "Concluída",
      valor: 1500,
      podeEstornar: false,
    },
    {
      id: 2,
      tipo: "transferencia",
      descricao: "Pagamento aluguel",
      data: "18/05/2025",
      status: "Concluída",
      valor: -1200,
      podeEstornar: true,
    },
  ];

  return (
    <section className="rounded-md border border-amber-400 bg-white p-4 shadow-sm">
      {/* Título */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Transações Recentes</h2>
        <p className="text-sm text-muted-foreground text-gray-400">
          Histórico das suas últimas transações
        </p>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-white">
            <tr>
              <th className="px-4 py-3 text-left">Tipo</th>
              <th className="px-4 py-3 text-left">Descrição</th>
              <th className="px-4 py-3 text-left">Data</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Valor</th>
              <th className="px-4 py-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={item.id}
                className="border-b last:border-b-0 hover:bg-gray-50"
              >
                {/* Tipo */}
                <td className="px-4 py-3 flex items-center gap-2">
                  {item.tipo === "transferencia" ? (
                    <ArrowUp className="h-4 w-4 text-red-500" />
                  ) : (
                    <ArrowDown className="h-4 w-4 text-green-500" />
                  )}
                  <span className="capitalize">{item.tipo}</span>
                </td>

                {/* Descrição */}
                <td className="px-4 py-3">{item.descricao}</td>

                {/* Data */}
                <td className="px-4 py-3">{item.data}</td>

                {/* Status */}
                <td className="px-4 py-3">
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-600">
                    {item.status}
                  </span>
                </td>

                {/* Valor */}
                <td className="px-4 py-3 text-right font-medium">
                  {item.valor < 0 ? (
                    <span className="text-red-600">
                      R$ {Math.abs(item.valor).toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-green-600">
                      R$ {item.valor.toFixed(2)}
                    </span>
                  )}
                </td>

                {/* Ações */}
                <td className="px-4 py-3 text-center">
                  {item.podeEstornar && (
                    <button className="flex items-center gap-1 rounded-md border border-gray-300 px-2 py-1 text-xs hover:bg-gray-100 dark:border-gray-700">
                      <RotateCcw className="h-3 w-3" />
                      Estornar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
