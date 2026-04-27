"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function BarChartComponent({ data }: { data: any[] }) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="fecha" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="ingresos" fill="#4ade80" />
          <Bar dataKey="gastos" fill="#f87171" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}