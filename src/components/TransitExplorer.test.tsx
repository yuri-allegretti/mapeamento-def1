import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { transitData } from "@/data/transit";
import { TransitExplorer } from "./TransitExplorer";

afterEach(cleanup);

describe("TransitExplorer", () => {
  it("busca linhas por destino", () => {
    render(<TransitExplorer data={transitData} />);
    fireEvent.change(screen.getByLabelText("Buscar linha, destino ou ponto"), { target: { value: "Cajuru" } });
    expect(screen.getByRole("heading", { name: "386 · CAJURU" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("1 linha encontrada");
  });

  it("inicia nos oito pontos mais próximos e permite trocar a faixa", () => {
    render(<TransitExplorer data={transitData} />);
    fireEvent.click(screen.getByRole("button", { name: "Pontos próximos" }));
    expect(screen.getByRole("status")).toHaveTextContent("8 pontos encontrados");
    fireEvent.change(screen.getByLabelText("Faixa de distância"), { target: { value: "601to1000" } });
    expect(screen.getByRole("status")).toHaveTextContent("41 pontos encontrados");
  });

  it("separa linhas pendentes sem sugerir ponto de embarque", () => {
    render(<TransitExplorer data={transitData} />);
    expect(screen.getByRole("heading", { name: "Linhas em validação" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "B03 · GUARAITUBA / ALTO DA XV (via T. MARACANÃ)" })).toBeInTheDocument();
  });
});
