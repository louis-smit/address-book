import { Form, Link } from "react-router";
import type { Route } from "./+types/login";
import { createUserSession } from "@/utils/session";
import { auth } from "@/data/accounts";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const { ok, data: token, errors } = await auth(data);

  if (!ok) return { errors };

  return createUserSession({
    request,
    userSession: {
      accessToken: token,
    },
    remember: true,
    redirectTo: "/app",
  });
}

export default function Login({ actionData }: Route.ComponentProps) {
  const errors = actionData?.errors;

  return (
    <div>
      <Form method="post" action="/login">
        <input type="text" name="email" placeholder="Email" />
        <input type="password" name="password" placeholder="Password" />

        {errors && <span>{errors}</span>}
        <button type="submit">Login</button>
      </Form>

      <Link to="/register">Register</Link>
    </div>
  );
}
