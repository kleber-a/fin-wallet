'use server';

import { api } from '@/lib/api';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function registerUser(formData: FormData) {
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const parsed = registerSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  try {
    await api.post('/api/register', parsed.data);

    return { success: true };
  } catch (error: any) {
    if (error.response) {
      // Resposta com erro vindo do servidor (status !== 2xx)
      return { error: error.response.data };
    } else {
      // Erro de conexão ou outro problema
      return { error: { server: ['Erro no servidor'] } };
    }
  }
}



const depositSchema = z.object({
  email: z.string().email(),
  amount: z
    .number({ invalid_type_error: 'O valor deve ser um número válido.' })
    .min(0.01, 'O valor do depósito deve ser maior que zero.')
    .max(1000000, 'O valor máximo de depósito é R$ 1.000.000,00.'),
  description: z.string().max(200).optional(),
});

export async function depositAction(formData: FormData) {

  const data = {
    email: formData.get("email"),
    amount: Number(formData.get("amount")),
    description: formData.get("description") as string | null,
  };


  const parsed = depositSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  try {
    const res = await api.post('/api/deposit', parsed.data);
    return {
      success: true,
      message: 'Depósito efetuado com sucesso!',
    };
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.error) {
      // Espera que error.response.data.error seja um objeto { server: [mensagem] }
      return { error: error.response.data.error };
    } else {
      return { error: { server: ['Erro no servidor'] } };
    }
  }
}

