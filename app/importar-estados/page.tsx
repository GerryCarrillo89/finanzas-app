"use client";

import { useState } from "react";
import { extractTextFromPDF } from "@/components/pdfReader";

export default function ImportarEstadosPage() {
  const [texto, setTexto] = useState<string[] | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const pages = await extractTextFromPDF(file);
    setTexto(pages);
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Importar estados de cuenta</h1>

      <input type="file" accept="application/pdf" onChange={handleFile} />

      {texto && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h2 className="font-semibold mb-2">Texto extraído:</h2>
          {texto.map((t, i) => (
            <pre key={i} className="text-xs whitespace-pre-wrap">
              {t}
            </pre>
          ))}
        </div>
      )}
    </div>
  );
}