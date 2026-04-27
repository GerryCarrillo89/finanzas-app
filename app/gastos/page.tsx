"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function GastosPage() {
  const [monto, setMonto] = useState("");
  const [categoria, setCategoria] = useState("");
  const [fecha, setFecha] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [gastos, setGastos] = useState<any[]>([]);

  const cargarGastos = async () => {
    const { data } = await supabase
      .from("gastos")
      .select("*")
      .order("fecha", { ascending: false });

    setGastos(data || []);
  };

  useEffect(() => {
    cargarGastos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    const { error } = await supabase.from("gastos").insert({
      monto,
      categoria,
      fecha,
      descripcion,
    });

    if (error) {
      setMensaje("Error al guardar el gasto");
    } else {
      setMensaje("Gasto guardado correctamente");
      setMonto("");
      setCategoria("");
      setFecha("");
      setDescripcion("");
      cargarGastos();
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Gastos</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md space-y-4 mb-10"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Monto</label>
          <input
            type="number"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Categoría</label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          >
            <option value="">Selecciona una categoría</option>
            <option value="comida">Comida</option>
            <option value="transporte">Transporte</option>
            <option value="servicios">Servicios</option>
            <option value="salud">Salud</option>
            <option value="otros">Otros</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Fecha</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full p-2 border rounded-lg"
            rows={3}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
        >
          {loading ? "Guardando..." : "Guardar Gasto"}
        </button>

        {mensaje && (
          <p className="text-center mt-2 text-sm text-gray-700">{mensaje}</p>
        )}
      </form>

      <h2 className="text-2xl font-bold mb-4">Lista de Gastos</h2>

      <div className="bg-white shadow-md rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">Fecha</th>
              <th className="p-3">Monto</th>
              <th className="p-3">Categoría</th>
              <th className="p-3">Descripción</th>
            </tr>
          </thead>
          <tbody>
            {gastos.map((g: any) => (
              <tr key={g.id} className="border-t">
                <td className="p-3">{g.fecha}</td>
                <td className="p-3">${g.monto}</td>
                <td className="p-3 capitalize">{g.categoria}</td>
                <td className="p-3">{g.descripcion || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}