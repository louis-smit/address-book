import { apiClient } from "@/utils/client";

export type LoginMutation = {
  email?: string;
  password?: string;
};

export async function auth(data: LoginMutation) {
  const result = await apiClient.post(`api/session`, {
    json: {
      user: {
        email: data.email,
        password: data.password,
      },
    },
  });

  const token = await result.text();
  return token;
}

export async function refreshToken(token: string) {
  const result = await apiClient.post(`api/session/refresh`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const refreshedToken = await result.text();
  return refreshedToken;
}
