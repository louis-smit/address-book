import { Form, redirect, useNavigate } from "react-router";
import type { Route } from "./+types/edit-contact";

import { getContact, updateContact } from "../data/contacts";
import { requireSession } from "~/utils/session";

export async function loader({ request, params }: Route.LoaderArgs) {
  const { apiClient } = await requireSession(request);
  const contact = await getContact(apiClient, params.contactId);
  if (!contact) {
    throw new Response("Not Found", { status: 404 });
  }
  return { contact };
}

export async function action({ request, params }: Route.ActionArgs) {
  const { apiClient } = await requireSession(request);
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateContact(apiClient, params.contactId, updates);

  return redirect(`/app/contacts/${params.contactId}`);
}

export default function EditContact({ loaderData }: Route.ComponentProps) {
  const { contact } = loaderData;
  const navigate = useNavigate();

  return (
    <Form
      key={contact.id}
      id="contact-form"
      method="post"
      encType="multipart/form-data"
    >
      <p>
        <span>Name</span>
        <input
          aria-label="First name"
          defaultValue={contact.first}
          name="first"
          placeholder="First"
          type="text"
        />
        <input
          aria-label="Last name"
          defaultValue={contact.last}
          name="last"
          placeholder="Last"
          type="text"
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          defaultValue={contact.twitter}
          name="twitter"
          placeholder="@jack"
          type="text"
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          aria-label="Avatar URL"
          defaultValue={contact.avatar}
          name="avatar"
          placeholder="https://example.com/avatar.jpg"
          type="text"
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea defaultValue={contact.notes} name="notes" rows={6} />
      </label>
      <p>
        <button type="submit">Save</button>
        <button onClick={() => navigate(-1)} type="button">
          Cancel
        </button>
      </p>
    </Form>
  );
}
