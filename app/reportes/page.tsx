"use client";

import { useState } from "react";
import DateRangePicker from "@/components/DateRangePicker";
import BarChartComponent from "@/components/BarChartComponent";
import PieChartComponent from "@/components/PieChartComponent";
import { getReportData } from "@/lib/getReportData";

export default function ReportesPage() {
  const [range, setRange] = useState<any>(null);
  const [data, setData] = useState<any>(null);

  const generarReporte = async () => {
    if (!range) return;

    const start = range.startDate.toISOString().split("T")[0];
    const end = range.endDate.toISOString().split("T")[0];

    const result = await getReportData(start, end);
    setData(result);
  };

  const ingresosPorCategoria = data?.ingresos.reduce((acc: any, item: any) => {
    acc[item.categoria] = (acc[item.categoria] || 0) + item.monto;
    return acc;
  }, {});

  const gastosPorCategoria = data?.gastos.reduce((acc: any, item: any) => {
    acc[item.categoria] = (acc[item.categoria] || 0) + item.monto;
    return acc;
  }, {});

  const pieDataIngresos = ingresosPorCategoria
    ? Object.entries(ingresosPorCategoria).map(([categoria, total]) => ({
        categoria,
        total,
      }))
    : [];

  const pieDataGastos = gastosPorCategoria
    ? Object.entries(gastosPorCategoria).map(([categoria, total]) => ({
        categoria,
        total,
      }))
    : [];

  const barData =
    data &&
    [...data.ingresos, ...data.gastos].map((item: any) => ({
      fecha: item.fecha,
      ingresos: data.ingresos.find((i: any) => i.fecha === item.fecha)?.monto || 0,
      gastos: data.gastos.find((g: any) => g.fecha === item.fecha)?.monto || 0,
    }));

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Reportes</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DateRangePicker onChange={setRange} />
        <button
          onClick={generarReporte}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Generar Reporte
        </button>
      </div>

      {data && (
        <>
          <h2 className="text-xl font-semibold">Ingresos vs Gastos</h2>
          <BarChartComponent data={barData} />

          <h2 className="text-xl font-semibold mt-6">Ingresos por Categoría</h2>
          <PieChartComponent data={pieDataIngresos} />

          <h2 className="text-xl font-semibold mt-6">Gastos por Categoría</h2>
          <PieChartComponent data={pieDataGastos} />
        </>
      )}
    </div>
  );
}