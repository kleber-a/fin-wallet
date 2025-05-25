import { registerUser, depositAction } from "./actions";
import { api } from "@/lib/api";

jest.mock("@/lib/api");

describe("registerUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar sucesso quando os dados são válidos e a API responde OK", async () => {
    (api.post as jest.Mock).mockResolvedValue({});

    const formData = new FormData();
    formData.append("name", "Kleber");
    formData.append("email", "kleber@example.com");
    formData.append("password", "123456");

    const result = await registerUser(formData);

    expect(api.post).toHaveBeenCalledWith("/api/register", {
      name: "Kleber",
      email: "kleber@example.com",
      password: "123456",
    });
    expect(result).toEqual({ success: true });
  });

  it("deve retornar erros de validação quando dados inválidos", async () => {
    const formData = new FormData();
    formData.append("name", "Jo");
    formData.append("email", "not-an-email");
    formData.append("password", "123");

    const result = await registerUser(formData);

    expect(result.error).toHaveProperty("name");
    expect(result.error).toHaveProperty("email");
    expect(result.error).toHaveProperty("password");
  });

  it("deve retornar erro vindo do servidor quando a API responde com erro", async () => {
    (api.post as jest.Mock).mockRejectedValue({
      response: { data: { message: "Email já cadastrado" } },
    });

    const formData = new FormData();
    formData.append("name", "Kleber");
    formData.append("email", "kleber@example.com");
    formData.append("password", "123456");

    const result = await registerUser(formData);

    expect(result).toEqual({ error: { message: "Email já cadastrado" } });
  });

  it("deve retornar erro genérico quando a API falhar sem response", async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error("Network error"));

    const formData = new FormData();
    formData.append("name", "Kleber");
    formData.append("email", "kleber@example.com");
    formData.append("password", "123456");

    const result = await registerUser(formData);

    expect(result).toEqual({ error: { server: ["Erro no servidor"] } });
  });
});

describe("depositAction", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar sucesso quando dados são válidos e API responde OK", async () => {
    (api.post as jest.Mock).mockResolvedValue({});

    const formData = new FormData();
    formData.append("email", "kleber@example.com");
    formData.append("amount", "100.50");
    formData.append("description", "Depósito teste");

    const result = await depositAction(formData);

    expect(api.post).toHaveBeenCalledWith("/api/deposit", {
      email: "kleber@example.com",
      amount: 100.5,
      description: "Depósito teste",
    });
    expect(result).toEqual({
      success: true,
      message: "Depósito efetuado com sucesso!",
    });
  });

  it("deve retornar erro de validação se amount inválido", async () => {
    const formData = new FormData();
    formData.append("email", "kleber@example.com");
    formData.append("amount", "0");
    formData.append("description", "Depósito teste");

    const result = await depositAction(formData);

    expect(result.error).toHaveProperty("amount");
  });

  it("deve retornar erro vindo do servidor quando API responde erro estruturado", async () => {
    (api.post as jest.Mock).mockRejectedValue({
      response: { data: { error: { server: ["Saldo insuficiente"] } } },
    });

    const formData = new FormData();
    formData.append("email", "kleber@example.com");
    formData.append("amount", "50");
    formData.append("description", "");

    const result = await depositAction(formData);

    expect(result).toEqual({ error: { server: ["Saldo insuficiente"] } });
  });

  it("deve retornar erro genérico quando API falhar sem resposta", async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error("Network error"));

    const formData = new FormData();
    formData.append("email", "kleber@example.com");
    formData.append("amount", "50");
    formData.append("description", "");

    const result = await depositAction(formData);

    expect(result).toEqual({ error: { server: ["Erro no servidor"] } });
  });
});
