'use client'

import DashboardNav from "@/components/dashboard-nav/page";
import { ChevronRight } from "lucide-react";
import { ReactNode, useState } from "react";



export default function DashboardLayout({ children }: { children: ReactNode }) {

  const [isOpen, setIsOpen] = useState(false);

  return (

    <div className="flex min-h-screen bg-white">
      <button
        className="md:hidden p-2 m-2 rounded bg-green-500 fixed top-12 left-0 z-40"
        onClick={() => setIsOpen(true)}
        aria-label="Abrir menu"
      >
        <ChevronRight className="w-3 h-3 text-gray-700" />
      </button>

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 max-w-3xs bg-white text-gray-900 flex flex-col shadow-lg
          transform transition-transform duration-300 ease-in-out
          md:static md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-4 text-lg font-bold border-b border-gray-300 flex justify-between items-center">
          Navegação
          <button
            className="md:hidden p-2 rounded hover:bg-gray-200"
            onClick={() => setIsOpen(false)}
            aria-label="Fechar menu"
          >
            ✕
          </button>
        </div>
        <DashboardNav />
      </aside>

      {isOpen && (
        <div
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
          className="fixed inset-0 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <main className="flex-1 p-6 bg-gray-10 overflow-x-hidden">
        {children}
      </main>
    </div>
  )
}