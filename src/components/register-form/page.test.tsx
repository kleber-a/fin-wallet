import '@testing-library/jest-dom';
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RegisterForm } from "./page";
import { registerUser } from "@/app/actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

jest.mock("@/app/actions", () => ({
  registerUser: jest.fn(),
}));

jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

jest.mock("../input/page", () => ({ name, label, placeholder, type, register, error }: any) => (
  <>
    <label htmlFor={name}>{label}</label>
    <input id={name} placeholder={placeholder} type={type} {...register(name)} />
    {error && <span>{error}</span>}
  </>
));

describe("RegisterForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza inputs e botão", () => {
    render(<RegisterForm />);
    expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^senha$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar senha/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /criar conta/i })).toBeInTheDocument();
  });

  it("valida erros do formulário antes de submeter", async () => {
    render(<RegisterForm />);

    fireEvent.click(screen.getByRole("button", { name: /criar conta/i }));

    expect(await screen.findByText(/nome deve ter ao menos 3 caracteres/i)).toBeInTheDocument();
    expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
    expect(screen.getByText(/senha deve ter ao menos 6 caracteres/i)).toBeInTheDocument();
  });

  it("submete formulário com sucesso e redireciona", async () => {
    (registerUser as jest.Mock).mockResolvedValue({ success: true });

    render(<RegisterForm />);

    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: "Kleber" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "kleber@test.com" } });
    fireEvent.change(screen.getByLabelText(/^senha$/i), { target: { value: "123456" } });
    fireEvent.change(screen.getByLabelText(/confirmar senha/i), { target: { value: "123456" } });

    fireEvent.click(screen.getByRole("button", { name: /criar conta/i }));

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Usuário criado com sucesso");
      expect(pushMock).toHaveBeenCalledWith("/login");
    });
  });

  it("exibe erro de registro ao falhar", async () => {
    (registerUser as jest.Mock).mockResolvedValue({
      success: false,
      error: {
        email: ["Email já cadastrado"],
      },
    });

    render(<RegisterForm />);

    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: "Kleber" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "kleber@test.com" } });
    fireEvent.change(screen.getByLabelText(/^senha$/i), { target: { value: "123456" } });
    fireEvent.change(screen.getByLabelText(/confirmar senha/i), { target: { value: "123456" } });

    fireEvent.click(screen.getByRole("button", { name: /criar conta/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Email já cadastrado");
      expect(pushMock).not.toHaveBeenCalled();
    });
  });
});
