import Footer from "@/components/footer/page";
import Header from "@/components/header/page";
import { Banknote, RotateCcw, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-16 md:py-28 lg:py-36 xl:py-48 bg-white flex justify-center">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              {/* Texto */}
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                    Sua <span className="text-green-600">Carteira Digital</span> Segura
                  </h1>
                  <p className="max-w-[600px] text-gray-600 md:text-xl dark:text-gray-400">
                    Gerencie seu dinheiro, faça transferências e depósitos de forma simples e segura.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link href="/register">
                    <button className="bg-green-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-700 transition-all">
                      Começar Agora
                    </button>
                  </Link>
                  <Link href="/login">
                    <button className="border border-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-100 transition-all">
                      Entrar
                    </button>
                  </Link>
                </div>
              </div>

              {/* Card */}
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-sm">
                  <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-3xl p-8 shadow-2xl">
                    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <p className="text-sm text-gray-500">Saldo Disponível</p>
                          <h3 className="text-3xl font-bold">R$ 2.500,00</h3>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-base text-gray-700">Transferência</span>
                          <button className="text-green-600 font-medium hover:underline">
                            Enviar
                          </button>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-base text-gray-700">Depósito</span>
                          <button className="text-green-600 font-medium hover:underline">
                            Depositar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-16 md:py-24 lg:py-32 bg-gray-50 flex justify-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <div className="space-y-3">
                <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                  Recursos Principais
                </h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl">
                  Nossa plataforma oferece tudo o que você precisa para gerenciar suas finanças.
                </p>
              </div>
            </div>


            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 py-12 md:grid-cols-3">
              {/* Card 1 */}
              <div className="flex flex-col items-center space-y-3 rounded-2xl bg-white p-6 shadow-md hover:shadow-lg transition-all">
                <div className="rounded-full bg-green-100 p-4">
                  <Banknote className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold">Depósitos Fáceis</h3>
                <p className="text-center text-gray-500">
                  Adicione saldo à sua conta de forma rápida e segura.
                </p>
              </div>

              {/* Card 2 */}
              <div className="flex flex-col items-center space-y-3 rounded-2xl bg-white p-6 shadow-md hover:shadow-lg transition-all">
                <div className="rounded-full bg-green-100 p-4">
                  <Send className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold">Transferências Instantâneas</h3>
                <p className="text-center text-gray-500">
                  Envie dinheiro para outros usuários em segundos.
                </p>
              </div>

              {/* Card 3 */}
              <div className="flex flex-col items-center space-y-3 rounded-2xl bg-white p-6 shadow-md hover:shadow-lg transition-all">
                <div className="rounded-full bg-green-100 p-4">
                  <RotateCcw className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold">Reversão de Operações</h3>
                <p className="text-center text-gray-500">
                  Reverta transações em caso de erros ou inconsistências.
                </p>
              </div>
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
