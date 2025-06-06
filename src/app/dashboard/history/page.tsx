import HeaderDashBoard from "@/components/header-dashboard/page";
import Table from "@/components/table/page";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function History() {

    const session = await getServerSession(authOptions);


    if(!session || !session.user) {
        redirect("/")
    }
    
    return (
        <div className="flex flex-col gap-10">
            <HeaderDashBoard heading="Histórico de Transações" text="Visualize todas as suas transações" /> 
            <div className="overflow-auto">
                <Table user={session.user} />
            </div>
        </div>
    )
}