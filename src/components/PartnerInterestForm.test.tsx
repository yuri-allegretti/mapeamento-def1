import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { PartnerInterestForm } from "./PartnerInterestForm";

afterEach(cleanup);

describe("PartnerInterestForm", () => {
  it("shows validation errors without submitting empty data", () => {
    render(<PartnerInterestForm />);
    fireEvent.click(screen.getByRole("button", { name: /enviar interesse/i }));
    expect(screen.getByRole("alert")).toHaveTextContent("Revise os campos");
    expect(screen.getByText("Informe o nome do estabelecimento.")).toBeInTheDocument();
  });

  it("completes a valid demonstration without an external service", async () => {
    render(<PartnerInterestForm />);
    fireEvent.change(screen.getByLabelText("Nome do estabelecimento"), { target: { value: "Café Exemplo" } });
    fireEvent.change(screen.getByLabelText("Pessoa responsável"), { target: { value: "Ana" } });
    fireEvent.change(screen.getByLabelText("E-mail"), { target: { value: "ana@example.com" } });
    fireEvent.change(screen.getByLabelText("Categoria"), { target: { value: "Alimentação" } });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: /enviar interesse/i }));
    expect(await screen.findByText("Interesse registrado na demonstração")).toBeInTheDocument();
    expect(screen.getByText(/Nenhuma informação foi enviada/)).toBeInTheDocument();
  });
});
