import { ArrowRightLeft, PiggyBank } from "lucide-react";
import Link from "next/link";

export default function ActionButtons() {
    
    return (
 <section className="rounded-md border border-amber-400 bg-white p-4 shadow-sm ">
  <div className="grid grid-cols-2 gap-4">
    <Link 
      href="/dashboard/deposit" 
      className="w-full h-20 flex flex-col items-center justify-center rounded-md bg-green-600 hover:bg-green-700 text-white"
    >
      <PiggyBank className="h-6 w-6 mb-1" />
      <span>Depositar</span>
    </Link>
    <Link 
      href="/dashboard/transfer" 
      className="w-full h-20 flex flex-col items-center justify-center rounded-md bg-green-600 hover:bg-green-700 text-white"
    >
      <ArrowRightLeft className="h-6 w-6 mb-1" />
      <span>Transferir</span>
    </Link>
  </div>
</section>
    )
}