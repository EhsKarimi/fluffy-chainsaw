import { Modal, Select, Stack, Text } from "@mantine/core";
import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { useAuth } from "@/modules/auth/context/useAuth";
import { appCommands, type AppCommandId } from "@/shared/constants/app-commands";
import { SharedTexts } from "@/shared/constants/SharedTexts";

type AppCommandModalProps = {
  opened: boolean;
  onClose: () => void;
};

export function AppCommandModal({ onClose, opened }: AppCommandModalProps) {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const [value, setValue] = useState<string | null>(null);

  const commandOptions = useMemo(
    () =>
      appCommands
        .filter((command) => (command.permission ? hasPermission(command.permission) : true))
        .map((command) => ({
          value: command.id,
          label: `${command.code} — ${command.label}`,
        })),
    [hasPermission],
  );

  const handleClose = () => {
    setValue(null);
    onClose();
  };

  const runCommand = async (commandId: AppCommandId) => {
    handleClose();

    switch (commandId) {
      case "dashboard-open":
        await navigate({ to: "/dashboard" });
        return;
      case "customer-list":
        await navigate({ to: "/crm/customers", search: {} });
        return;
      case "customer-create":
        await navigate({ to: "/crm/customers", search: { action: "new" } });
        return;
      case "project-list":
        await navigate({ to: "/crm/projects" });
        return;
      case "reports-open":
        await navigate({ to: "/reports" });
        return;
      case "settings-users":
        await navigate({ to: "/settings/users" });
        return;
      case "settings-roles":
        await navigate({ to: "/settings/roles" });
        return;
      case "profile-open":
        await navigate({ to: "/profile" });
        return;
    }
  };

  return (
    <Modal opened={opened} onClose={handleClose} title={SharedTexts.CommandPalette.ModalTitle} radius="xl" size="lg" centered dir="rtl">
      <Stack gap="sm">
        <Select
          data={commandOptions}
          value={value}
          onChange={(nextValue) => {
            setValue(nextValue);

            if (nextValue) {
              void runCommand(nextValue as AppCommandId);
            }
          }}
          searchable
          clearable
          autoFocus
          maxDropdownHeight={280}
          nothingFoundMessage={SharedTexts.CommandPalette.EmptyState}
          placeholder={SharedTexts.CommandPalette.SearchPlaceholder}
          comboboxProps={{ withinPortal: true, zIndex: 10000 }}
        />
        <Text size="xs" c="dimmed">
          {SharedTexts.CommandPalette.CodeHint}
        </Text>
      </Stack>
    </Modal>
  );
}
