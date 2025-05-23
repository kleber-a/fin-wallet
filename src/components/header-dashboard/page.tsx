"use client"

import { signOut, useSession } from "next-auth/react";

interface DashboardHeaderProps {
    heading: string
    text?: string
    // children?: React.ReactNode
}

export default function HeaderDashBoard({ heading, text }: DashboardHeaderProps) {

    const {status, data} = useSession();

    async function logout() {
        await signOut();
    }

    return (
        <div className="flex items-start justify-between px-2 flex-col gap-2 flex-wrap">
                <h1 className="text-2xl font-bold tracking-wide">{heading}</h1>
                <p className="text-gray-500 dark:text-gray-400">{text}</p>
        </div>
    )
}