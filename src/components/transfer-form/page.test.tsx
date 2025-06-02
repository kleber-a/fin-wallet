import '@testing-library/jest-dom';
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import TransferForm from "./page";
import { getUser, postTransfer } from "@/lib/api";

import { api } from "@/lib/api";
import toast from "react-hot-toast";

jest.mock("@/lib/api");

const toastMock = Object.assign(jest.fn(), {
  success: jest.fn(),
  error: jest.fn(),
});

jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: Object.assign(jest.fn(), {
    success: jest.fn(),
    error: jest.fn(),
  }),
}));


describe("TransferForm", () => {
  const mockUser = { email: "me@example.com" };

  const mockMyUser = {
    email: "me@example.com",
    wallet: 500.0,
  };

  const mockOtherUsers = [
    { email: "user1@example.com", wallet: 100 },
    { email: "user2@example.com", wallet: 200 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (getUser as jest.Mock).mockResolvedValue({
      user: mockMyUser,
      users: mockOtherUsers,
    });
    (postTransfer as jest.Mock).mockResolvedValue({});
  });

  it("mostra erro quando destinatário não é selecionado", async () => {
    render(<TransferForm user={mockUser} />);
    const submitButton = await screen.findByRole("button", { name: /transferir/i });
    expect(submitButton).toBeTruthy();

  });

  it("mostra erro quando valor excede saldo", async () => {
    render(<TransferForm user={mockUser} />);

    const destinatarioSelect = await screen.findByLabelText(/Destinatário/i);
    const valueTransfer = await screen.getByLabelText(/Valor da Transferência/i)
    const buttonTransfer = await screen.getByRole("button", { name: /transferir/i });

    fireEvent.change(destinatarioSelect, {
      target: { value: "user1@example.com" },
    });

    fireEvent.change(valueTransfer, {
      target: { value: "1000000,00" }, // maior que saldo
    });

    fireEvent.click(buttonTransfer);

    await waitFor(() => {
      expect(screen.getByText(/Saldo insuficiente/i)).toBeInTheDocument();
    });
  });


  it("realiza transferência com sucesso", async () => {
    render(<TransferForm user={mockUser} />);

    const destinatarioSelect = await screen.findByLabelText(/Destinatário/i);
    const valorInput = screen.getByLabelText(/Valor da Transferência/i);
    const descricaoInput = screen.getByLabelText(/Descrição \(opcional\)/i);
    const buttonTransfer = screen.getByRole("button", { name: /transferir/i });

    fireEvent.change(destinatarioSelect, {
      target: { value: "user1@example.com" },
    });

    fireEvent.change(valorInput, {
      target: { value: "100,00" },
    });

    fireEvent.change(descricaoInput, {
      target: { value: "Teste de transferência" },
    });

    fireEvent.click(buttonTransfer);

    await waitFor(() => {
      expect(postTransfer).toHaveBeenCalledWith(
        "user1@example.com",
        100,
        "Teste de transferência"
      );
    });

    expect(getUser).toHaveBeenCalledTimes(2);

    expect(toast.success).toHaveBeenCalledWith("Transferência realizada");
  });

});
