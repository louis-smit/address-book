import {
  createCookie,
  createCookieSessionStorage,
  redirect,
} from "react-router";
import * as jose from "jose";
import { differenceInMinutes } from "date-fns";
import { createClient } from "./client";
import invariant from "tiny-invariant";
import { refreshToken } from "@/data/accounts";

const DEFAULT_REDIRECT = "/";

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT
) {
  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }

  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect;
  }

  return to;
}

type SessionData = {
  userId: string;
  accessToken: string;
};

type SessionFlashData = {
  error: string;
};

export const sessionCookie = createCookie("__session", {
  httpOnly: true,
  maxAge: 0,
  path: "/",
  sameSite: "lax",
  secrets: ["s3cret1"],
  secure: process.env.NODE_ENV === "production",
});

export const sessionStorage = createCookieSessionStorage<
  SessionData,
  SessionFlashData
>({
  cookie: sessionCookie,
});

async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");

  return sessionStorage.getSession(cookie);
}

export type UserSession = {
  accessToken: string;
};

export async function requireSession(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getSession(request);
  const accessToken = session.get("accessToken");

  if (!session || !accessToken) {
    const searchParams = new URLSearchParams([["redirect", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }

  await authenticateRequest(request);

  const apiClient = createClient({ accessToken });

  return { session, apiClient };
}

export async function createUserSession({
  request,
  userSession,
  remember,
  redirectTo,
}: {
  request: Request;
  userSession: UserSession;
  remember: boolean;
  redirectTo: string;
}) {
  const session = await getSession(request);
  session.set("accessToken", userSession.accessToken);

  const headers = new Headers();

  headers.append(
    "Set-Cookie",
    await sessionStorage.commitSession(session, {
      maxAge: remember
        ? 60 * 60 * 24 * 7 // 7 days
        : undefined,
      expires: new Date(
        Date.now() + 60 * 60 * 24 * 7 * 1000 // 7 days
      ),
    })
  );

  throw redirect(redirectTo, { headers });
}

async function authenticateRequest(request: Request) {
  const session = await getSession(request);

  const MIN_TOKEN_LIFETIME_IN_MINUTES = 10_000; // 1 week

  const accessToken = session.get("accessToken");
  invariant(accessToken);

  const claims = jose.decodeJwt(accessToken);
  const tokenExpiryMs = claims.exp! * 1000;
  const diffInMinutes = differenceInMinutes(tokenExpiryMs, Date.now());

  // Token is expired and we don't have refresh tokens so we need to log out
  if (diffInMinutes <= 0) {
    throw await logout(request, { login: true });
  }

  // Token is close to expiring so we need to refresh it
  if (diffInMinutes <= MIN_TOKEN_LIFETIME_IN_MINUTES) {
    const { ok, data: updatedToken } = await refreshToken(accessToken);

    if (!ok) throw await logout(request, { login: true });

    const updatedSession: UserSession = {
      accessToken: updatedToken,
    };

    throw await createUserSession({
      request,
      remember: true,
      redirectTo: new URL(request.url).pathname,
      userSession: updatedSession,
    });
  }
}

export async function logout(request: Request, init?: { login: boolean }) {
  const session = await getSession(request);

  const headers = new Headers();
  headers.append("Clear-Site-Data", "cookies"); // Only Chrome support

  // Remove session
  headers.append("Set-Cookie", await sessionStorage.destroySession(session));

  const { login = false } = init || {};

  let pathname = "/";

  if (login) {
    const redirectTo = new URL(request.url).pathname;
    const searchParams = new URLSearchParams([["redirect", redirectTo]]);
    pathname = `/login?${searchParams}`;
  }

  return redirect(pathname, { headers });
}
