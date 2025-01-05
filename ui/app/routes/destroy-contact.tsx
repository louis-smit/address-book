import { redirect } from "react-router";
import type { Route } from "./+types/destroy-contact";

import { requireSession } from "@/utils/session";
import { deleteContact } from "@/data/contacts";

export async function action({ request, params }: Route.ActionArgs) {
  const { apiClient } = await requireSession(request);
  await deleteContact(apiClient, params.contactId);
  return redirect("/");
}
