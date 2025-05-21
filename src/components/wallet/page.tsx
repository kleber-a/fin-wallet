
export default function Wallet() {
    return (
        <section className="rounded-md border border-amber-400 bg-white p-4 shadow-sm ">
            <h3 className="text-sm font-medium text-black">
                Saldo Disponível
            </h3>
            <div className="mt-2 text-4xl font-bold text-green-600">
                R$ 1.000,00
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Atualizado em {new Date().toLocaleDateString("pt-BR")}
            </p>
        </section>
    )
}