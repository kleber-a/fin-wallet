
import { redirect } from "next/navigation"
import Link from "next/link"
import { RegisterForm } from "@/components/register-form/page"
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


export default async function RegisterPage() {

  const session = await getServerSession(authOptions);


    if(session && session.user) {
        redirect("/dashboard")
    }


  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Link href="/" className="flex items-center justify-center">
            {/* <Wallet className="h-8 w-8 text-green-600" /> */}
            <span className="ml-2 text-2xl font-bold">FinWallet</span>
          </Link>
          <h1 className="text-2xl font-bold">Criar uma conta</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Preencha os dados abaixo para criar sua carteira digital
          </p>
        </div>
        <RegisterForm />
        <div className="text-center text-sm">
          <p>
            Já tem uma conta?{" "}
            <Link href="/login" className="font-medium text-green-600 hover:text-green-500">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
