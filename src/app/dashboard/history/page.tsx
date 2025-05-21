import DashboardNav from "@/components/dashboard-nav/page";
import HeaderDashBoard from "@/components/header-dashboard/page";
import Table from "@/components/table/page";

export default function History() {
    return (
        <DashboardNav>
            <HeaderDashBoard heading="Histórico de Transações" text="Visualize todas as suas transações" /> 
            <Table />
        </DashboardNav>
    )
}