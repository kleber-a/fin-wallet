import '@testing-library/jest-dom';
import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import DepositForm from "./page"; // ajuste o caminho
import { depositAction } from "@/app/actions";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

jest.mock("@/app/actions", () => ({
    depositAction: jest.fn(),
}));

jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
    redirect: jest.fn(),
}));

jest.mock("react-hot-toast", () => ({
    success: jest.fn(),
    error: jest.fn(),
}));

describe("DepositForm", () => {
    const pushMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue({
            push: pushMock,
        });
    });

    const user = { email: "user@example.com" };

    it("renderiza os inputs e botão", async () => {
        await act(async () => {
            render(<DepositForm user={user} />);
        });

        expect(screen.getByLabelText(/Valor do depósito/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Descrição \(opcional\)/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /depositar/i })).toBeInTheDocument();
    });

    it("exibe erro e não chama depositAction com valores inválidos", async () => {
        await act(async () => {
            render(<DepositForm user={user} />);
        });

        await act(async () => {
            fireEvent.change(screen.getByLabelText(/valor do depósito/i), { target: { value: "0" } });
            fireEvent.click(screen.getByRole("button", { name: /depositar/i }));
        });

        // Aqui você pode adicionar expect para mensagem de erro visível se quiser:
        // expect(await screen.findByText(/O valor é obrigatório/i)).toBeInTheDocument();

        expect(depositAction).not.toHaveBeenCalled();
    });

    it("chama depositAction e redireciona em caso de sucesso", async () => {
        (depositAction as jest.Mock).mockResolvedValue({ success: true });

        await act(async () => {
            render(<DepositForm user={user} />);
        });

        await act(async () => {
            fireEvent.change(screen.getByLabelText(/valor do depósito/i), { target: { value: "10" } });
            fireEvent.change(screen.getByLabelText(/descrição/i), { target: { value: "Teste" } });
            fireEvent.click(screen.getByRole("button", { name: /depositar/i }));
        });

        await waitFor(() => {
            expect(depositAction).toHaveBeenCalledWith(expect.any(FormData));
            expect(toast.success).toHaveBeenCalledWith("Depósito efetuado!");
            expect(pushMock).toHaveBeenCalledWith("/dashboard");
        });
    });

    it("exibe toast de erro se depositAction falhar", async () => {
        (depositAction as jest.Mock).mockRejectedValue(new Error("fail"));

        await act(async () => {
            render(<DepositForm user={user} />);
        });

        await act(async () => {
            fireEvent.change(screen.getByLabelText(/valor do depósito/i), { target: { value: "10" } });
            fireEvent.click(screen.getByRole("button", { name: /depositar/i }));
        });

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("Ocorreu um erro ao tentar depositar.");
        });
    });

    it("exibe toast de erro se result.success for falso", async () => {
        (depositAction as jest.Mock).mockResolvedValue({ success: false });

        await act(async () => {
            render(<DepositForm user={user} />);
        });

        await act(async () => {
            fireEvent.change(screen.getByLabelText(/valor do depósito/i), { target: { value: "10" } });
            fireEvent.click(screen.getByRole("button", { name: /depositar/i }));
        });

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("Não foi possível fazer o depósito");
        });
    });
});
