import { api } from "@/lib/api";
import axios from "axios";


export async function getUser(email: string) {
  try {
    const response = await api.get("/api/users");
    const user = response.data.userAuthenticated;
    const users = response.data.users;

    return { user, users };
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return null;
  }
}