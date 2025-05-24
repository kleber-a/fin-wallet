import { api } from "@/lib/api";
import axios from "axios";


export async function getUser(email: string) {
  try {
    const response = await api.get("/api/user");
    const user = response.data.userAuthenticated;
    const users = response.data.users;

    return { user, users };
  } catch (error) {
    return null;
  }
}