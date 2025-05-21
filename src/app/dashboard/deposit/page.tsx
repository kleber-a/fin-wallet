import DashboardNav from "@/components/dashboard-nav/page";
import DepositForm from "@/components/deposit-form/page";
import HeaderDashBoard from "@/components/header-dashboard/page";

export default function Deposit() {
    return (
        <DashboardNav>

            <HeaderDashBoard heading="Depositar" text="Adicione saldo à sua carteira" /> 
            <DepositForm />

        </DashboardNav>
    )
}