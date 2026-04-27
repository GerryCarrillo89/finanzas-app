import React from "react";

interface SummaryCardProps {
  title: string;
  amount: number;
  color?: string;
}

export default function SummaryCard({ title, amount, color = "blue" }: SummaryCardProps) {
  return (
    <div className={`p-6 rounded-xl shadow-md border-l-4 border-${color}-500 bg-white`}>
      <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold mt-2">${amount.toLocaleString()}</p>
    </div>
  );
}