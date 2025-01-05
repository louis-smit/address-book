import type { Route } from "./+types/login";
import { createUserSession } from "@/utils/session";
import { auth } from "@/data/auth";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const token = await auth(data);

  return createUserSession({
    request,
    userSession: {
      accessToken: token,
    },
    remember: true,
    redirectTo: "/app",
  });
}

export default function Login() {
  return (
    <div>
      <form method="post" action="/login">
        <input
          value="louis@appsquare.dev"
          type="text"
          name="email"
          placeholder="Email"
        />
        <input
          value="Secret1234!!"
          type="password"
          name="password"
          placeholder="Password"
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
