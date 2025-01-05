import { apiClient } from "@/utils/client";
import type { FieldErrors } from "~/types";

export type RegisterMutation = {
  email: string;
  password: string;
};

export type LoginMutation = Partial<RegisterMutation>;

export async function auth(data: LoginMutation) {
  const result = await apiClient.post(`api/session`, {
    json: {
      user: {
        email: data.email,
        password: data.password,
      },
    },
  });

  const message = await result.text();

  if (!result.ok) {
    return { ok: false, errors: message } as const;
  }
  return { ok: true, data: message } as const;
}

export async function refreshToken(token: string) {
  const result = await apiClient.post(`api/session/refresh`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!result.ok) {
    return { ok: false } as const;
  }

  const refreshedToken = await result.text();
  return { ok: true, data: refreshedToken } as const;
}

export async function register(data: RegisterMutation) {
  const result = await apiClient.post(`api/register`, {
    json: {
      user: {
        email: data.email,
        password: data.password,
      },
    },
  });

  if (result.status !== 200) {
    const { errors } = (await result.json()) as {
      errors: FieldErrors<RegisterMutation>;
    };

    return { ok: false, errors } as const;
  }

  const token = await result.text();
  return { ok: true, data: token } as const;
}
