import DashboardNav from "@/components/dashboard-nav/page";
import HeaderDashBoard from "@/components/header-dashboard/page";
import TransferForm from "@/components/transfer-form/page";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Transfer() {

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/")
    }

    return (
        <div className="w-full flex flex-col gap-10">
            <HeaderDashBoard heading="Transferir" text="Envie dinheiro para outros usuários" />
            <TransferForm user={session.user} />
        </div>

    )
}