import type { ContactRecord, ContactMutation } from "@/data/contacts";
import { matchSorter } from "match-sorter";
// @ts-expect-error - no types, but it's a tiny function
import sortBy from "sort-by";

import type { ApiClient } from "@/utils/client";
import { jsonToFormData } from "@/utils/form-data";

export async function getContacts(apiClient: ApiClient, query?: string | null) {
  const { data } = await apiClient
    .get<{ data: ContactRecord[] }>("api/contacts")
    .json();

  let contacts = data;
  if (query) {
    contacts = matchSorter(contacts, query, {
      keys: ["first", "last"],
    });
  }
  return contacts.sort(sortBy("last", "createdAt"));
}

export async function createEmptyContact(apiClient: ApiClient) {
  const { data: contact } = await apiClient
    .post<{ data: ContactRecord }>("api/contacts", {
      json: { contact: {} },
    })
    .json();
  return contact;
}

export async function getContact(apiClient: ApiClient, id: string) {
  const { data: contact } = await apiClient
    .get<{ data: ContactRecord }>(`api/contacts/${id}`)
    .json();
  return contact;
}

export async function updateContact(
  apiClient: ApiClient,
  id: string,
  updates: ContactMutation
) {
  // let formData = new FormData();
  // formData = jsonToFormData(updates, formData, "contact");
  const { data: contact } = await apiClient
    .patch<{ data: ContactRecord }>(`api/contacts/${id}`, {
      json: { contact: updates },
    })
    .json();

  return contact;
}

export async function deleteContact(apiClient: ApiClient, id: string) {
  await apiClient.delete(`api/contacts/${id}`);
}
