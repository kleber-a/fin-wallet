"use client"
import React, { useState } from "react";

export default function DepositForm() {
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");

  const saldoDisponivel = 1000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você pode colocar a lógica do envio do formulário
    alert(`Depositando R$${valor} - ${descricao}`);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto rounded-md border p-6 shadow-md bg-white">
      <label htmlFor="valor" className="block mb-1 font-medium">
        Valor do depósito (R$)
      </label>
      <input
        type="number"
        id="valor"
        required
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        className="w-full rounded border px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
        min="0"
        step="0.01"
      />

      <label htmlFor="descricao" className="block mb-1 font-medium">
        Descrição (opcional)
      </label>
      <input
        type="text"
        id="descricao"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        className="w-full rounded border px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
      >
        Depositar
      </button>
        <p className="mt-4 text-center text-gray-600">
                Saldo Disponível:{" "}
                <span className="font-bold text-green-700">
                    R$ {saldoDisponivel.toFixed(2).replace(".", ",")}
                </span>
            </p>
    </form>
  );
}
