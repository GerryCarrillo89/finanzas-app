"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function IngresosPage() {
  const [monto, setMonto] = useState("");
  const [categoria, setCategoria] = useState("");
  const [fecha, setFecha] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [ingresos, setIngresos] = useState([]);

  const cargarIngresos = async () => {
    const { data } = await supabase
      .from("ingresos")
      .select("*")
      .order("fecha", { ascending: false });

    setIngresos(data || []);
  };

  useEffect(() => {
    cargarIngresos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    const { error } = await supabase.from("ingresos").insert({
      monto,
      categoria,
      fecha,
      descripcion,
    });

    if (error) {
      setMensaje("Error al guardar el ingreso");
    } else {
      setMensaje("Ingreso guardado correctamente");
      setMonto("");
      setCategoria("");
      setFecha("");
      setDescripcion("");
      cargarIngresos();
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Ingresos</h1>

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
            <option value="salario">Salario</option>
            <option value="ventas">Ventas</option>
            <option value="inversiones">Inversiones</option>
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
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
        >
          {loading ? "Guardando..." : "Guardar Ingreso"}
        </button>

        {mensaje && (
          <p className="text-center mt-2 text-sm text-gray-700">{mensaje}</p>
        )}
      </form>

      <h2 className="text-2xl font-bold mb-4">Lista de Ingresos</h2>

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
            {ingresos.map((i: any) => (
              <tr key={i.id} className="border-t">
                <td className="p-3">{i.fecha}</td>
                <td className="p-3">${i.monto}</td>
                <td className="p-3 capitalize">{i.categoria}</td>
                <td className="p-3">{i.descripcion || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}