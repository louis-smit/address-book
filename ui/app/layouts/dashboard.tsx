import { useEffect } from "react";
import {
  Form,
  Link,
  NavLink,
  Outlet,
  redirect,
  useNavigation,
  useSubmit,
} from "react-router";

import type { Route } from "./+types/dashboard";

import { requireSession } from "@/utils/session";
import { createEmptyContact, getContacts } from "@/data/contacts";

export async function loader({ request }: Route.LoaderArgs) {
  const { apiClient } = await requireSession(request);

  const url = new URL(request.url);
  const q = url.searchParams.get("q");

  const contacts = await getContacts(apiClient, q);
  return { contacts, q };
}

export async function action({ request }: Route.ActionArgs) {
  const { apiClient } = await requireSession(request);
  const contact = await createEmptyContact(apiClient);
  return redirect(`/app/contacts/${contact.id}`);
}

export default function SidebarLayout({ loaderData }: Route.ComponentProps) {
  const { contacts, q } = loaderData;
  const navigation = useNavigation();
  const submit = useSubmit();
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");

  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);

  return (
    <>
      <div id="sidebar">
        <h1 className="">
          <Link to="/about">About</Link>
        </h1>

        <span className="logout">
          <form action="/app/logout" method="post">
            <button type="submit">Log out</button>
          </form>
        </span>

        <div>
          <Form
            id="search-form"
            onChange={(event) => {
              const isFirstSearch = q === null;

              submit(event.currentTarget, {
                replace: !isFirstSearch,
              });
            }}
            role="search"
          >
            <input
              aria-label="Search contacts"
              className={searching ? "loading" : ""}
              defaultValue={q || ""}
              id="q"
              name="q"
              placeholder="Search"
              type="search"
            />
            <div aria-hidden hidden={!searching} id="search-spinner" />
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink
                    className={({ isActive, isPending }) =>
                      isActive ? "active" : isPending ? "pending" : ""
                    }
                    to={`/app/contacts/${contact.id}`}
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}
                    {contact.favorite ? <span>★</span> : null}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div
        id="detail"
        className={
          navigation.state === "loading" && !searching ? "loading" : ""
        }
      >
        <Outlet />
      </div>
    </>
  );
}
