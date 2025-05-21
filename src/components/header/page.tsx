import Link from "next/link";

export default function Header() {
    return(
          <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="/" className="flex items-center justify-center">
          {/* <Wallet className="h-6 w-6 text-green-600" /> */}
          <span className="ml-2 text-xl font-bold">FinWallet</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4">
            Entrar
          </Link>
          <Link href="/register" className="text-sm font-medium hover:underline underline-offset-4">
            Cadastrar
          </Link>
        </nav>
      </header>
    )
}