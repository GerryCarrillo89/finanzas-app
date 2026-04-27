import { supabase } from "./supabaseClient";

export async function getReportData(start: string, end: string) {
  const { data: ingresos } = await supabase
    .from("ingresos")
    .select("*")
    .gte("fecha", start)
    .lte("fecha", end);

  const { data: gastos } = await supabase
    .from("gastos")
    .select("*")
    .gte("fecha", start)
    .lte("fecha", end);

  return { ingresos: ingresos || [], gastos: gastos || [] };
}