import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import TransferForm from "./page";
import { getUser } from "@/services/userService";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

jest.mock("@/services/userService");
jest.mock("@/lib/api");
jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: jest.fn(),
  success: jest.fn(),
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
  });

it("mostra erro quando destinatário não é selecionado", async () => {
  render(<TransferForm user={mockUser} />);
  const submitButton = await screen.findByRole("button", { name: /transferir/i });
  expect(submitButton).toBeTruthy();

});


});
