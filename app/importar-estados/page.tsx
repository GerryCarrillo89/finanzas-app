"use client";

export default function ImportarEstadosPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Importar estados de cuenta</h1>
      <p className="text-sm text-gray-500">
        Sube tus estados de cuenta en PDF (BBVA, Santander) para convertirlos en movimientos y analizarlos por categorías.
      </p>

      <div className="mt-4 border rounded-lg p-4 bg-white">
        <p className="text-sm text-gray-600 mb-2">
          Paso 1: selecciona el archivo PDF de tu banco.
        </p>
        <input
          type="file"
          accept="application/pdf"
          className="text-sm"
        />
      </div>

      {/* Aquí luego vamos a mostrar:
          - Detección de banco
          - Vista previa de movimientos
          - Botón para guardar en Supabase
      */}
    </div>
  );
}