'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { ArrowRightLeft, History, LayoutDashboard, LogOut, PiggyBank, Wallet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
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


export default function DashboardNav() {
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


  return (
    <nav className="flex-1  space-y-2 overflow-y-auto">
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`flex items-center  px-4 py-5 text-sm font-medium transition-colors
              ${isActive
                ? "bg-green-100 text-green-700 border-l-4 border-green-600"
                : "text-gray-800 hover:bg-green-700 hover:text-white"}
            `}
          >
            {item.icon}
            {item.title}
          </Link>
        );
      })}
    </nav>
  )
}
