import DashboardNav from "@/components/dashboard-nav/page";
import HeaderDashBoard from "@/components/header-dashboard/page";
import TransferForm from "@/components/transfer-form/page";

export default function Transfer() {
    return (
        <DashboardNav>
            <HeaderDashBoard heading="Transferir" text="Envie dinheiro para outros usuários" >

            <TransferForm />
            </HeaderDashBoard>
        </DashboardNav>
    )
}