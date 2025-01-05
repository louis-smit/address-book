import type { RouteConfig } from "@react-router/dev/routes";
import { index, layout, route, prefix } from "@react-router/dev/routes";

export default [
  index("routes/index.tsx"),
  route("login", "routes/login.tsx"),
  route("/app", "layouts/dashboard.tsx", [
    index("routes/home.tsx"),
    route("logout", "routes/logout.tsx"),
    route("contacts/:contactId", "routes/contact.tsx"),
    route("contacts/:contactId/edit", "routes/edit-contact.tsx"),
    route("contacts/:contactId/destroy", "routes/destroy-contact.tsx"),
  ]),
  route("about", "routes/about.tsx"),
] satisfies RouteConfig;
