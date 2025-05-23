import ActionButtons from "@/components/action-buttons/page";
import DashboardNav from "@/components/dashboard-nav/page";
import HeaderDashBoard from "@/components/header-dashboard/page";
import Table from "@/components/table/page";
import Wallet from "@/components/wallet/page";
import { authOptions } from '@/lib/auth'
import axios from "axios";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function DashBoard() {
    const session = await getServerSession(authOptions);


    if (!session || !session.user) {
        redirect("/")
    }


    return (
        // <DashboardNav>
        <div className="w-full flex flex-col gap-10">

            <HeaderDashBoard heading="Dashboard" text="Bem-vindo de volta, Usuário Demo!" />
            <div className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
                    <Wallet user={session.user} />
                    <ActionButtons />
                </div>
                <div className="mt-6">
                    <Table user={session.user} qtd={3} />
                </div>
            </div>
        </div>
        // </DashboardNav>
    )
}