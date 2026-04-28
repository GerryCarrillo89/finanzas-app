"use client";

import { useState } from "react";

export default function ImportarEstadosPage() {
  const [texto, setTexto] = useState<string[] | null>(null);

  async function extractTextFromPDF(file: File): Promise<string[]> {
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");

    pdfjsLib.GlobalWorkerOptions.workerSrc =
      `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    const pages: string[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      const strings = content.items.map((item: any) => item.str);
      pages.push(strings.join(" "));
    }

    return pages;
  }

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