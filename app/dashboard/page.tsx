"use client";

import { useEffect, useState } from "react";
import DateRangePicker from "@/components/DateRangePicker";
import BarChartComponent from "@/components/BarChartComponent";
import PieChartComponent from "@/components/PieChartComponent";
import { supabase } from "@/lib/supabaseClient";

type Movimiento = {
  id: string;
  fecha: string;
  monto: number;
  categoria: string;
  descripcion: string | null;
};

type CategoriaData = {
  categoria: string;
  total: number;
};

export default function DashboardPage() {
  const [range, setRange] = useState<any>({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date(),
  });

  const [ingresos, setIngresos] = useState<Movimiento[]>([]);
  const [gastos, setGastos] = useState<Movimiento[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (!range?.startDate || !range?.endDate) return;
    setLoading(true);

    const start = range.startDate.toISOString().split("T")[0];
    const end = range.endDate.toISOString().split("T")[0];

    const { data: ingresosData } = await supabase
      .from("ingresos")
      .select("*")
      .gte("fecha", start)
      .lte("fecha", end)
      .order("fecha", { ascending: false });

    const { data: gastosData } = await supabase
      .from("gastos")
      .select("*")
      .gte("fecha", start)
      .lte("fecha", end)
      .order("fecha", { ascending: false });

    setIngresos((ingresosData as Movimiento[]) || []);
    setGastos((gastosData as Movimiento[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // -----------------------------
  // CÁLCULOS PRINCIPALES
  // -----------------------------

  const totalIngresos = ingresos.reduce((acc, i) => acc + i.monto, 0);
  const totalGastos = gastos.reduce((acc, g) => acc + g.monto, 0);
  const balance = totalIngresos - totalGastos;

  // -----------------------------
  // GASTOS POR CATEGORÍA (TIPADO)
  // -----------------------------

  const gastosPorCategoria =
    Array.isArray(gastos) && gastos.length > 0
      ? gastos.reduce((acc: any, item) => {
          acc[item.categoria] = (acc[item.categoria] || 0) + item.monto;
          return acc;
        }, {})
      : {};

  const pieDataGastos: CategoriaData[] = Object.entries(gastosPorCategoria).map(
    ([categoria, total]) => ({
      categoria,
      total: total as number,
    })
  );

  const categoriaTop: CategoriaData | null =
    pieDataGastos.length > 0
      ? pieDataGastos.reduce(
          (max: CategoriaData, item: CategoriaData) =>
            item.total > max.total ? item : max
        )
      : null;

  // -----------------------------
  // GRÁFICA DE BARRAS
  // -----------------------------

  const fechasSet = new Set<string>();
  ingresos.forEach((i) => fechasSet.add(i.fecha));
  gastos.forEach((g) => fechasSet.add(g.fecha));

  const barData = Array.from(fechasSet)
    .sort()
    .map((fecha) => ({
      fecha,
      ingresos:
        ingresos
          .filter((i) => i.fecha === fecha)
          .reduce((acc, i) => acc + i.monto, 0) || 0,
      gastos:
        gastos
          .filter((g) => g.fecha === fecha)
          .reduce((acc, g) => acc + g.monto, 0) || 0,
    }));

  // -----------------------------
  // ÚLTIMOS MOVIMIENTOS
  // -----------------------------

  const ultimosMovimientos = [
    ...ingresos.map((i) => ({ ...i, tipo: "Ingreso" })),
    ...gastos.map((g) => ({ ...g, tipo: "Gasto" })),
  ]
    .sort((a, b) => (a.fecha < b.fecha ? 1 : -1))
    .slice(0, 10);

  // -----------------------------
  // UI
  // -----------------------------

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-gray-500">
            Resumen general de tus finanzas
          </p>
        </div>

        <div className="flex gap-3 items-center w-full md:w-auto">
          <div className="w-full md:w-72">
            <DateRangePicker
              onChange={(r) =>
                setRange({ startDate: r.startDate, endDate: r.endDate })
              }
            />
          </div>

          <button
            onClick={fetchData}
            className="bg-indigo-600 text-white px-4 py-2 rounded text-sm"
          >
            {loading ? "Cargando..." : "Actualizar"}
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <p className="text-xs text-gray-500">Ingresos (rango)</p>
          <p className="text-2xl font-semibold text-emerald-600">
            ${totalIngresos.toFixed(2)}
          </p>
        </div>

        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <p className="text-xs text-gray-500">Gastos (rango)</p>
          <p className="text-2xl font-semibold text-rose-600">
            ${totalGastos.toFixed(2)}
          </p>
        </div>

        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <p className="text-xs text-gray-500">Balance</p>
          <p
            className={`text-2xl font-semibold ${
              balance >= 0 ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            ${balance.toFixed(2)}
          </p>
        </div>

        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <p className="text-xs text-gray-500">Categoría con más gasto</p>
          {categoriaTop ? (
            <>
              <p className="text-sm font-medium">{categoriaTop.categoria}</p>
              <p className="text-lg font-semibold text-rose-600">
                ${categoriaTop.total.toFixed(2)}
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-400">Sin datos en el rango</p>
          )}
        </div>
      </div>

      {/* GRÁFICA PRINCIPAL */}
      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Ingresos vs Gastos</h2>
        <BarChartComponent data={barData} />
      </div>

      {/* DISTRIBUCIÓN + ACCESOS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border rounded-lg p-4 shadow-sm md:col-span-2">
          <h2 className="text-lg font-semibold mb-2">Gastos por categoría</h2>

          {pieDataGastos.length > 0 ? (
            <PieChartComponent data={pieDataGastos} />
          ) : (
            <p className="text-sm text-gray-400">Sin datos en el rango.</p>
          )}
        </div>

        <div className="bg-white border rounded-lg p-4 shadow-sm flex flex-col gap-3">
          <h2 className="text-lg font-semibold">Accesos rápidos</h2>

          <a
            href="/ingresos"
            className="w-full text-center bg-emerald-600 text-white py-2 rounded text-sm"
          >
            + Nuevo ingreso
          </a>

          <a
            href="/gastos"
            className="w-full text-center bg-rose-600 text-white py-2 rounded text-sm"
          >
            + Nuevo gasto
          </a>

          <a
            href="/reportes"
            className="w-full text-center bg-indigo-600 text-white py-2 rounded text-sm"
          >
            Ver reportes
          </a>
        </div>
      </div>

      {/* ÚLTIMOS MOVIMIENTOS */}
      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Últimos movimientos</h2>

        {ultimosMovimientos.length === 0 ? (
          <p className="text-sm text-gray-400">No hay movimientos en el rango.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-2 pr-4">Fecha</th>
                  <th className="py-2 pr-4">Tipo</th>
                  <th className="py-2 pr-4">Categoría</th>
                  <th className="py-2 pr-4">Monto</th>
                  <th className="py-2 pr-4">Descripción</th>
                </tr>
              </thead>

              <tbody>
                {ultimosMovimientos.map((m) => (
                  <tr key={m.id} className="border-b last:border-0">
                    <td className="py-2 pr-4">{m.fecha}</td>

                    <td className="py-2 pr-4">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          m.tipo === "Ingreso"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {m.tipo}
                      </span>
                    </td>

                    <td className="py-2 pr-4">{m.categoria}</td>

                    <td className="py-2 pr-4">${m.monto.toFixed(2)}</td>

                    <td className="py-2 pr-4">{m.descripcion || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}