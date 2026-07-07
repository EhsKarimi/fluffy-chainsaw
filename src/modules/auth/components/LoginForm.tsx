import { Alert, ThemeIcon } from "@mantine/core";
import { IconInfoCircle, IconKey, IconLock, IconUser } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { AuthTexts } from "@/modules/auth/constants/AuthTexts";
import { mockAuthUsers } from "@/modules/auth/constants/mock-users";
import { useAuth } from "@/modules/auth/context/useAuth";
import { type LoginValues } from "@/modules/auth/types/auth.types";
import { useAppForm } from "@/shared/components/form/form";
import { requestScrollToFirstFormError } from "@/shared/components/form/scrollToFirstFormError";
import { SharedTexts } from "@/shared/constants/SharedTexts";
import { getPublicAssetUrl } from "@/shared/utils/getPublicAssetUrl";

export function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);

  const form = useAppForm({
    defaultValues: {
      username: "",
      password: "",
    } satisfies LoginValues,
    onSubmit: async ({ value }) => {
      setAuthError(null);

      const result = await login(value);

      if (!result.success) {
        setAuthError(result.message);
        return;
      }

      await navigate({ to: "/dashboard", replace: true });
    },
  });

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900" dir="rtl">
      <div className="lg:grid-cols-auth-panel grid min-h-screen grid-cols-1">
        <section className="auth-hero-panel relative hidden overflow-hidden p-12 text-white lg:flex lg:flex-col lg:items-center lg:justify-center lg:gap-10">
          <div className="auth-hero-glow-soft absolute top-20 -left-20 h-64 w-64 rounded-full blur-3xl" />
          <div className="auth-hero-glow-strong absolute right-10 bottom-0 h-72 w-72 rounded-full blur-3xl" />

          <div className="flex justify-center">
            <div className="w-[40%]">
              <img src={getPublicAssetUrl("images/logo.png")} alt={SharedTexts.BrandName} className="h-full w-full object-contain" />
            </div>
          </div>

          <div className="relative z-10 max-w-2xl space-y-8">
            <div>
              <h1 className="leading-auth-title text-4xl font-black xl:text-4xl">{AuthTexts.Login.HeroTitle}</h1>
              <p className="mt-6 text-lg leading-8 text-cyan-50">{AuthTexts.Login.HeroDescription}</p>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-4">
            <ThemeIcon size="xl" radius="xl" variant="light" color="atisCyan">
              <IconKey size={24} />
            </ThemeIcon>
            <p className="text-cyan-50">{AuthTexts.Login.RememberedSessionHint}</p>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
          <div className="max-w-auth-form w-full">
            <div className="flex justify-center lg:hidden">
              <div className="mb-4 w-48">
                <img src={getPublicAssetUrl("images/logo.png")} alt={SharedTexts.BrandName} className="h-full w-full object-contain" />
              </div>
            </div>

            <section className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-xl sm:p-8">
              <div className="space-y-8">
                <div className="flex flex-col items-center gap-2">
                  <p className="text-xl font-bold">{AuthTexts.Login.Title}</p>
                  <p className="text-sm">{AuthTexts.Login.Subtitle}</p>
                </div>

                {authError ? (
                  <Alert color="red" radius="md" icon={<IconInfoCircle size={18} />}>
                    {authError}
                  </Alert>
                ) : null}

                <form.AppForm>
                  <form
                    noValidate
                    className="flex flex-col gap-5"
                    onSubmit={(event) => {
                      event.preventDefault();
                      event.stopPropagation();

                      const formElement = event.currentTarget;

                      void form.handleSubmit();
                      requestScrollToFirstFormError(formElement);
                    }}
                  >
                    <form.AppField
                      name="username"
                      validators={{
                        onChange: ({ value }) => (value.trim() ? undefined : AuthTexts.Validation.UsernameRequired),
                      }}
                    >
                      {(field) => (
                        <field.TextInputField
                          autoComplete="username"
                          label={AuthTexts.Login.UsernameLabel}
                          placeholder={AuthTexts.Login.UsernamePlaceholder}
                          leftSection={<IconUser size={18} />}
                          size="md"
                        />
                      )}
                    </form.AppField>

                    <form.AppField
                      name="password"
                      validators={{
                        onChange: ({ value }) => (value ? undefined : AuthTexts.Validation.PasswordRequired),
                      }}
                    >
                      {(field) => (
                        <field.PasswordInputField
                          autoComplete="current-password"
                          label={AuthTexts.Login.PasswordLabel}
                          placeholder={AuthTexts.Login.PasswordPlaceholder}
                          leftSection={<IconLock size={18} />}
                          size="md"
                        />
                      )}
                    </form.AppField>

                    <form.SubmitButton size="md" fullWidth mt="xs">
                      {AuthTexts.Login.Submit}
                    </form.SubmitButton>
                  </form>
                </form.AppForm>
              </div>
            </section>

            <section className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white/80 p-4">
              <div className="space-y-2">
                <p className="text-sm font-bold text-slate-900">{AuthTexts.Login.DevelopmentUsersTitle}</p>
                <p className="text-xs text-slate-500">{AuthTexts.Login.DevelopmentUsersDescription}</p>
                {mockAuthUsers.map((mockUser) => (
                  <div key={mockUser.user.id} className="flex justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2">
                    <span className="text-xs font-semibold text-slate-900">{mockUser.user.username}</span>
                    <span className="text-xs text-slate-500" dir="ltr">
                      {mockUser.password}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
