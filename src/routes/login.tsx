import { createFileRoute } from "@tanstack/react-router";

import { GuestOnly } from "@/modules/auth/components/GuestOnly";
import { LoginForm } from "@/modules/auth/components/LoginForm";

export const Route = createFileRoute("/login")({
  component: LoginRoute,
});

function LoginRoute() {
  return (
    <GuestOnly>
      <LoginForm />
    </GuestOnly>
  );
}
