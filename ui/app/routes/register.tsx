import { Form, Link } from "react-router";
import type { Route } from "./+types/register";
import { createUserSession } from "@/utils/session";
import { register } from "@/data/accounts";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const { ok, data: accessToken, errors } = await register(data as any);

  if (!ok) return { errors };

  return createUserSession({
    request,
    userSession: {
      accessToken,
    },
    remember: true,
    redirectTo: "/app",
  });
}

export default function Register({ actionData }: Route.ComponentProps) {
  const errors = actionData?.errors;

  return (
    <div>
      <Form method="post">
        <input type="text" name="email" placeholder="Email" />
        {errors?.email && <span>{errors.email[0]}</span>}
        <input type="password" name="password" placeholder="Password" />
        {errors?.password && <span>{errors.password[0]}</span>}
        <button type="submit">Login</button>
      </Form>

      <Link to="/login">Login</Link>
    </div>
  );
}
