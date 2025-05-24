import '@testing-library/jest-dom';
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import SettingsForm from "./page";
import { api, getUser } from "@/lib/api";
import { signOut } from "next-auth/react";


jest.mock("@/lib/api");
jest.mock("next-auth/react", () => ({
  signOut: jest.fn(),
}));

describe("SettingsForm", () => {
  const mockedGetUser = getUser as jest.Mock;
  const mockedApi = api as jest.Mocked<typeof api>;
  const mockedSignOut = signOut as jest.Mock;

  beforeEach(() => {
    mockedGetUser.mockResolvedValue({
      user: { name: "Kleber" },
    });

    mockedApi.put = jest.fn().mockResolvedValue({});
    mockedApi.delete = jest.fn().mockResolvedValue({});

    mockedSignOut.mockClear();
  });

  it("deve carregar e exibir o nome do usuário", async () => {
    render(<SettingsForm />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Kleber")).toBeInTheDocument();
    });
  });

  it("deve permitir alterar o nome e salvar", async () => {
    render(<SettingsForm />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Kleber")).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText("Digite seu nome");
    fireEvent.change(input, { target: { value: "Kleber Dev" } });

    const button = screen.getByRole("button", { name: /salvar/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockedApi.put).toBeDefined();
    });
  });

  it("deve sair da conta ao clicar no botão sair", async () => {
    render(<SettingsForm />);

    const logoutButton = screen.getByRole("button", { name: /sair da conta/i });
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(mockedSignOut).toHaveBeenCalled();
    });
  });


});
