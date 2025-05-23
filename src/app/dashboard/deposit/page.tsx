import DepositForm from "@/components/deposit-form/page";
import HeaderDashBoard from "@/components/header-dashboard/page";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Deposit() {

    const session = await getServerSession(authOptions);


    if (!session || !session.user) {
        redirect("/")
    }


    return (
        <div className="flex flex-col gap-10">
            <HeaderDashBoard heading="Depositar" text="Adicione saldo à sua carteira" />
            <DepositForm user={session.user} />
        </div>
    )
}