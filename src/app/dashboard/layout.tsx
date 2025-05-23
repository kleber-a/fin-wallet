import { ArrowRightLeft, History, LayoutDashboard, PiggyBank } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface NavItem {
    title: string;
    href: string;
    icon?: React.ReactNode;
}

export default function DashboardLayout({ children }: { children: ReactNode }) {

      const items: NavItem[] = [
        {
            title: "Dashboard",
            href: "/dashboard",
            icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
        },
        {
            title: "Transferir",
            href: "/dashboard/transfer",
            icon: <ArrowRightLeft className="mr-2 h-4 w-4" />,
        },
        {
            title: "Depositar",
            href: "/dashboard/deposit",
            icon: <PiggyBank className="mr-2 h-4 w-4" />,
        },
        {
            title: "Histórico",
            href: "/dashboard/history",
            icon: <History className="mr-2 h-4 w-4" />,
        }
    ];


    return (

            <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 text-lg font-bold border-b border-gray-600">
          Meu App
        </div>
        <nav className="flex-1 p-4 space-y-2">
           {items.map((item) => {
              return (
                   <Link
                    href={item.href}
                    className="block rounded px-3 py-2 hover:bg-gray-700"
                  >
                    {item.icon}
                    {item.title}
                  </Link>
              );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
    )
}