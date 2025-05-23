import LoginForm from "@/components/login-form/page"
import { authOptions } from "@/lib/auth";
import { Wallet } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link"
import { redirect } from "next/navigation";

export default async function LoginPage() {
 const session = await getServerSession(authOptions);


    if(session && session.user) {
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
            Acesse sua Conta
          </h1>
          <p className="text-base text-gray-600">
            Entre com seu e-mail e senha para gerenciar suas finanças.
          </p>
        </div>
        <LoginForm />
        <div className="text-center text-sm mt-6">
          <p className="text-gray-600">
            Não tem uma conta?{" "}
            <Link
              href="/register"
              className="font-semibold text-green-700 hover:text-green-800 transition-colors duration-200" // Cor mais escura no hover
            >
              Cadastre-se aqui!
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
