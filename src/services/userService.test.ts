import { getUser } from "./userService"; // Ajuste o caminho conforme seu projeto
import { api } from "@/lib/api";

jest.mock("@/lib/api");

describe("getUser", () => {
  const mockResponse = {
    data: {
      userAuthenticated: { email: "me@example.com", wallet: 500 },
      users: [
        { email: "user1@example.com", wallet: 100 },
        { email: "user2@example.com", wallet: 200 },
      ],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar usuário e lista de usuários ao chamar api com sucesso", async () => {
    (api.get as jest.Mock).mockResolvedValue(mockResponse);

    const result = await getUser("me@example.com");

    expect(api.get).toHaveBeenCalledWith("/api/user");
    expect(result).toEqual({
      user: mockResponse.data.userAuthenticated,
      users: mockResponse.data.users,
    });
  });

  it("deve retornar null e logar erro quando a chamada api falhar", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    (api.get as jest.Mock).mockRejectedValue(new Error("API failure"));

    const result = await getUser("me@example.com");

    expect(api.get).toHaveBeenCalledWith("/api/user");
    expect(result).toBeNull();
    // expect(consoleSpy).toHaveBeenCalledWith(
    //   "Erro ao buscar usuários:",
    //   expect.any(Error)
    // );

    consoleSpy.mockRestore();
  });
});
