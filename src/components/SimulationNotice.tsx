export function SimulationNotice({ compact = false }: { compact?: boolean }) {
  return (
    <aside
      aria-label="Aviso sobre os dados"
      className={`border border-amber-300 bg-amber-50 text-amber-950 ${compact ? "px-3 py-2 text-xs" : "px-4 py-3 text-sm"}`}
    >
      <strong>Dados demonstrativos.</strong>{" "}
      Benefícios, VR, caminhada, transporte e parte das informações foram simulados para validar a estrutura do MVP.
    </aside>
  );
}
