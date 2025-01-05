import ky, { type KyInstance } from "ky";

export const apiClient = ky.extend({
  prefixUrl: "http://localhost:4000",
  throwHttpErrors: false,
});

export function createClient({ accessToken }: { accessToken: string }) {
  return ky.create({
    prefixUrl: "http://localhost:4000",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export type ApiClient = KyInstance;
