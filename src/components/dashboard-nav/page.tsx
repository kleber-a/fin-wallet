'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { ArrowRightLeft, History, LayoutDashboard, LogOut, PiggyBank, Wallet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
// import { cn } from "@/lib/utils";
// import { buttonVariants } from "@/components/ui/button";
// import { LayoutDashboard, ArrowRightLeft, PiggyBank, History, Settings, Wallet } from "lucide-react";

interface DashboardNavProps {
    children: React.ReactNode;
}

interface NavItem {
    title: string;
    href: string;
    icon?: React.ReactNode;
}


export default function DashboardNav({ children }: DashboardNavProps) {
    const pathname = usePathname();

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

    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()


    return (
        <div className="flex min-h-screen flex-col">

            <div className="grid flex-1 gap-8 md:grid-cols-[220px_1fr] lg:grid-cols-[260px_1fr] px-5">
                <aside className="hidden md:flex flex-col border-r pr-4">
                    <nav className="grid gap-1  p-5">
                        {items.map((item) => {
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    aria-current={isActive ? "page" : undefined}
                                    className={`flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors
                                    ${isActive ? "bg-green-100 text-green-700 border-l-4 border-green-600" : "text-gray-700 hover:bg-green-50 hover:text-green-700"}
                                    `}
                                >
                                    {item.icon}
                                    {item.title}
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                <main className="flex w-full flex-1 flex-col py-6">{children}</main>
            </div>
        </div>
    );
}
