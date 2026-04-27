import SummaryCard from "@/components/SummaryCard";

export default function DashboardPage() {
  const ingresos = 12500;
  const gastos = 4800;
  const balance = ingresos - gastos;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard Financiero</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard title="Ingresos" amount={ingresos} color="green" />
        <SummaryCard title="Gastos" amount={gastos} color="red" />
        <SummaryCard title="Balance" amount={balance} color="blue" />
      </div>
    </div>
  );
}