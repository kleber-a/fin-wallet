import ActionButtons from "@/components/action-buttons/page";
import DashboardNav from "@/components/dashboard-nav/page";
import HeaderDashBoard from "@/components/header-dashboard/page";
import Table from "@/components/table/page";
import Wallet from "@/components/wallet/page";

export default function DashBoard() {
    return (
        <DashboardNav>
            <HeaderDashBoard heading="Dashboard" text="Bem-vindo de volta, Usuário Demo!" /> 

            <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
            <Wallet />
            <ActionButtons />
            </div>
            <div className="mt-6">
                <Table />
            </div>
        </DashboardNav>
    )
}