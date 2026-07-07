import { Button, Modal } from "@mantine/core";
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
      <div className="space-y-6">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600 ring-1 ring-red-100">
            <IconAlertTriangle size={24} />
          </div>
          <div>
            <p className="font-extrabold text-slate-900">{buildDeleteMessage(entityType, entityName)}</p>
            <p className="mt-1.5 text-sm leading-7 text-slate-500">{description}</p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="default" onClick={onClose} disabled={loading}>
            {SharedTexts.Common.Cancel}
          </Button>
          <Button color="red" onClick={onConfirm} loading={loading}>
            {SharedTexts.Common.ConfirmDelete}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
