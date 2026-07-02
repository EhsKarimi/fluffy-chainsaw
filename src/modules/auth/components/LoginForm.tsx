import { Alert, Box, Group, Image, Paper, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import { IconInfoCircle, IconKey, IconLock, IconUser } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { useAppForm } from "@/shared/components/form/form";
import { requestScrollToFirstFormError } from "@/shared/components/form/scrollToFirstFormError";

import { SharedTexts } from "@/shared/constants/SharedTexts";

import { AuthTexts } from "@/modules/auth/constants/AuthTexts";
import { mockAuthUsers } from "@/modules/auth/constants/mock-users";
import { useAuth } from "@/modules/auth/context/useAuth";
import { type LoginValues } from "@/modules/auth/types/auth.types";
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
              <Image src={getPublicAssetUrl("images/logo.png")} alt={SharedTexts.BrandName} fit="contain" />
            </div>
          </div>

          <Stack className="relative z-10 max-w-2xl" gap="xl">
            <div>
              <Title order={1} className="leading-auth-title text-4xl font-black xl:text-4xl">
                {AuthTexts.Login.HeroTitle}
              </Title>
              <Text mt="lg" size="lg" c="cyan.0" className="leading-8">
                {AuthTexts.Login.HeroDescription}
              </Text>
            </div>
          </Stack>

          <Group className="relative z-10" gap="md">
            <ThemeIcon size="xl" radius="xl" variant="light" color="atisCyan">
              <IconKey size={24} />
            </ThemeIcon>
            <Text c="cyan.0">{AuthTexts.Login.RememberedSessionHint}</Text>
          </Group>
        </section>

        <section className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
          <Box className="max-w-auth-form w-full">
            <div className="mb-8 flex flex-col items-center text-center lg:hidden">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-white p-3 shadow-md ring-1 ring-slate-200">
                <Image
                  src={getPublicAssetUrl("images/logo.png")}
                  alt={SharedTexts.BrandName}
                  fit="contain"
                  fallbackSrc={getPublicAssetUrl("favicon.svg")}
                />
              </div>
              <Title order={2}>{SharedTexts.BrandName}</Title>
              <Text c="dimmed">{SharedTexts.BrandDescription}</Text>
            </div>

            <Paper radius="xl" p={{ base: "lg", sm: "xl" }} shadow="xl" className="border border-slate-200/80 bg-white/95">
              <Stack gap="xl">
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
              </Stack>
            </Paper>

            <Paper mt="md" p="md" radius="lg" className="border border-dashed border-slate-300 bg-white/80">
              <Stack gap="xs">
                <Text size="sm" fw={700}>
                  {AuthTexts.Login.DevelopmentUsersTitle}
                </Text>
                <Text size="xs" c="dimmed">
                  {AuthTexts.Login.DevelopmentUsersDescription}
                </Text>
                {mockAuthUsers.map((mockUser) => (
                  <Group key={mockUser.user.id} justify="space-between" gap="xs" className="rounded-lg bg-slate-50 px-3 py-2">
                    <Text size="xs" fw={600}>
                      {mockUser.user.username}
                    </Text>
                    <Text size="xs" c="dimmed" dir="ltr">
                      {mockUser.password}
                    </Text>
                  </Group>
                ))}
              </Stack>
            </Paper>
          </Box>
        </section>
      </div>
    </main>
  );
}
