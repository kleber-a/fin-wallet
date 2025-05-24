import axios from "axios";

export const api = axios.create({
    baseURL: process.env.BASE_URL as string
})


export async function getUser() {
  try {
    const response = await api.get("/api/user");
    const user = response.data.userAuthenticated;
    const users = response.data.users;

    return { user, users };
  } catch (error) {
    return null;
  }
}


export async function postTransfer(email: string, amount:number, description: string | null) {
  try {
    const response = await api.post("/api/transfer", {
        toEmail: email,
        amount: amount,
        description: description,
    });
    return response.data;
  } catch (error) {
    throw error; 
  }
}

export async function putUser(name: string) {
  try {
    const response = await api.put("/api/user", { name });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteUser() {
  try {
    const response = await api.delete("/api/user");
    return response.data;
  } catch (error) {
    throw error;
  }
}


export async function getHistory() {
  try {
    const response = await api.get("/api/history");
    return response;
  } catch (error) {
    throw error;
  }
}

export async function postReverse(transactionId: string) {
  try {
    const response = await api.post("/api/reverse", { transactionId });
    return response.data;
  } catch (error) {
    throw error;
  }
}
