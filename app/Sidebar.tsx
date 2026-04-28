"use client";
import { DocumentArrowUpIcon } from "@heroicons/react/24/outline";
import {
  HomeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const linkClasses = (path: string) =>
    `flex items-center gap-3 p-2 rounded-lg transition ${
      pathname === path
        ? "bg-gray-200 text-black font-semibold"
        : "text-gray-700 hover:bg-gray-100 hover:text-black"
    }`;

  return (
    <aside className="w-64 bg-white shadow-md p-6">
      <h2 className="text-xl font-bold mb-6">Finanzas App</h2>

      <nav className="flex flex-col gap-4">

        <a href="/dashboard" className={linkClasses("/dashboard")}>
          <HomeIcon className="h-5 w-5" />
          Dashboard
        </a>

        <a href="/ingresos" className={linkClasses("/ingresos")}>
          <ArrowTrendingUpIcon className="h-5 w-5" />
          Ingresos
        </a>

        <a href="/gastos" className={linkClasses("/gastos")}>
          <ArrowTrendingDownIcon className="h-5 w-5" />
          Gastos
        </a>

        <a href="/reportes" className={linkClasses("/reportes")}>
          <ChartBarIcon className="h-5 w-5" />
          Reportes
        </a>

        <a href="/importar-estados" className={linkClasses("/importar-estados")}>
          <DocumentArrowUpIcon className="h-5 w-5" />
          Importar estados
        </a>

      </nav>
    </aside>
  );
}