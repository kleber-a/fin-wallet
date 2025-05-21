"use client"
import { useState } from "react";

export default function TransferForm() {

    const [destinatario, setDestinatario] = useState("");
    const [valor, setValor] = useState("");
    const [descricao, setDescricao] = useState("");

    // Exemplo de destinatários para o select
    const destinatarios = [
        { id: "1", nome: "João Silva" },
        { id: "2", nome: "Maria Oliveira" },
        { id: "3", nome: "Empresa X" },
    ];

    const saldoDisponivel = 1000;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Aqui você pode colocar a lógica de envio, validação, etc.
        alert(
            `Transferindo R$ ${valor} para ${destinatario}${descricao ? " com descrição: " + descricao : ""
            }`
        );
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto rounded-md border p-6 shadow-md bg-white"
        >
            {/* Destinatário */}
            <label htmlFor="destinatario" className="block mb-2 font-medium">
                Destinatário
            </label>
            <select
                id="destinatario"
                required
                value={destinatario}
                onChange={(e) => setDestinatario(e.target.value)}
                className="w-full rounded border px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none pr-8 relative"
                style={{
                    backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='gray' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.5rem center',
                    backgroundSize: '1rem'
                }}
            >
                <option value="" disabled>
                    Selecione o destinatário
                </option>
                {destinatarios.map((d) => (
                    <option key={d.id} value={d.nome}>
                        {d.nome}
                    </option>
                ))}
            </select>

            {/* Valor da Transferência */}
            <label htmlFor="valor" className="block mb-2 font-medium">
                Valor da Transferência (R$)
            </label>
            <input
                id="valor"
                type="number"
                min="0"
                step="0.01"
                required
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="0,00"
                className="w-full rounded border px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {/* Descrição (opcional) */}
            <label htmlFor="descricao" className="block mb-2 font-medium">
                Descrição (opcional)
            </label>
            <input
                id="descricao"
                type="text"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descrição da transferência"
                className="w-full rounded border px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {/* Botão Transferir */}
            <button
                type="submit"
                className="w-full rounded bg-green-600 py-2 font-semibold text-white hover:bg-green-700 transition"
            >
                Transferir
            </button>

            {/* Saldo Disponível */}
            <p className="mt-4 text-center text-gray-600">
                Saldo Disponível:{" "}
                <span className="font-bold text-green-700">
                    R$ {saldoDisponivel.toFixed(2).replace(".", ",")}
                </span>
            </p>
        </form>
    )
}