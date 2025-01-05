import type { Route } from "./+types/destroy-contact";

import { logout } from "@/utils/session";

export async function action({ request }: Route.ActionArgs) {
  return await logout(request);
}
