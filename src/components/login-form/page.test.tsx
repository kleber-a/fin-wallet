import '@testing-library/jest-dom';
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "./page";  // ajuste o caminho conforme seu projeto
import { signIn, getSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
  getSession: jest.fn(),
}));

jest.mock("react-hot-toast", () => ({
  error: jest.fn(),
  success: jest.fn(),
}));

const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza inputs e botão", () => {
    render(<LoginForm />);
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
  });

  it("faz login com sucesso e redireciona", async () => {
    (signIn as jest.Mock).mockResolvedValue({ error: null });
    (getSession as jest.Mock).mockResolvedValue({ user: { email: "user@test.com" } });

    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "user@test.com" } });
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: "123456" } });

    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("credentials", {
        redirect: false,
        email: "user@test.com",
        password: "123456",
      });
    });

    await waitFor(() => {
      expect(getSession).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Sucesso");
      expect(pushMock).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("exibe erro de login e não redireciona", async () => {
    (signIn as jest.Mock).mockResolvedValue({ error: "Invalid credentials" });

    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "wrong@test.com" } });
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: "wrongpass" } });

    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("credentials", {
        redirect: false,
        email: "wrong@test.com",
        password: "wrongpass",
      });
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Email ou senha inválidos");
      expect(pushMock).not.toHaveBeenCalled();
    });
  });
});
