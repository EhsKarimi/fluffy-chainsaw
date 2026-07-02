import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";

import { SharedTexts } from "@/shared/constants/SharedTexts";

type DeleteConfirmationModalProps = {
  opened: boolean;
  entityType: string;
  entityName: string;
  description?: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

function buildDeleteMessage(entityType: string, entityName: string) {
  return SharedTexts.DeleteConfirmation.Message.replace("{entityType}", entityType).replace("{entityName}", entityName);
}

export function DeleteConfirmationModal({
  description = SharedTexts.DeleteConfirmation.DefaultDescription,
  entityName,
  entityType,
  loading,
  onClose,
  onConfirm,
  opened,
}: DeleteConfirmationModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title={SharedTexts.DeleteConfirmation.Title} centered radius="xl" dir="rtl">
      <Stack gap="lg">
        <Group gap="sm" align="flex-start" wrap="nowrap">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600 ring-1 ring-red-100">
            <IconAlertTriangle size={24} />
          </div>
          <div>
            <Text fw={800} className="text-slate-900">
              {buildDeleteMessage(entityType, entityName)}
            </Text>
            <Text size="sm" c="dimmed" mt={6} className="leading-7">
              {description}
            </Text>
          </div>
        </Group>

        <Group justify="flex-end" gap="sm">
          <Button variant="default" onClick={onClose} disabled={loading}>
            {SharedTexts.Common.Cancel}
          </Button>
          <Button color="red" onClick={onConfirm} loading={loading}>
            {SharedTexts.Common.ConfirmDelete}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
