
import { redirect } from "next/navigation"
import Link from "next/link"
import { RegisterForm } from "@/components/register-form/page"
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Wallet } from "lucide-react";


export default async function RegisterPage() {

  const session = await getServerSession(authOptions);


  if (session && session.user) {
    redirect("/dashboard")
  }


  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-2xl">
        <div className="flex flex-col items-center space-y-4 text-center">
          <Link href="/" className="flex items-center justify-center mb-4">
            <Wallet className="h-10 w-10 text-green-600" />
            <span className="ml-3 text-3xl font-extrabold text-gray-900">FinWallet</span>
          </Link>

          <h1 className="text-3xl font-extrabold text-gray-900">
            Crie sua Conta
          </h1>
          <p className="text-base text-gray-600">
            É rápido e fácil! Preencha seus dados para começar a usar sua carteira digital.
          </p>
        </div>

        <RegisterForm />

        <div className="text-center text-sm mt-6">
          <p className="text-gray-600">
            Já tem uma conta?{" "}
            <Link
              href="/login"
              className="font-semibold text-green-700 hover:text-green-800 transition-colors duration-200"
            >
              Entrar aqui!
            </Link>
          </p>
        </div>
      </div>
    </div>


  )
}
