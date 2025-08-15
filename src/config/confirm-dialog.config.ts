import { ConfirmVariant } from "@/components/common/confirm-variant";

export enum ConfirmType {
  Delete = "delete",
  Update = "update",
  Logout = "logout",
  Reset = "reset",
  Submit = "submit",
  Discard = "discard",
}

export const GLOBAL_CONFIRM_CONFIGS: Record<
  ConfirmType,
  {
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    variant: ConfirmVariant;
  }
> = {
  delete: {
    title: "Confirm Delete",
    message: "Are you sure you want to delete this item?",
    confirmText: "Delete",
    cancelText: "Cancel",
    variant: ConfirmVariant.Destructive,
  },
  update: {
    title: "Confirm Update",
    message: "Are you sure you want to update this item?",
    confirmText: "Update",
    cancelText: "Cancel",
    variant: ConfirmVariant.Success,
  },
  logout: {
    title: "Confirm Logout",
    message: "Are you sure you want to log out?",
    confirmText: "Logout",
    cancelText: "Cancel",
    variant: ConfirmVariant.Default,
  },
  reset: {
    title: "Reset Settings",
    message: "This will reset all values. Continue?",
    confirmText: "Reset",
    cancelText: "Cancel",
    variant: ConfirmVariant.Default,
  },
  submit: {
    title: "Confirm Submit",
    message: "Do you want to submit this form?",
    confirmText: "Submit",
    cancelText: "Cancel",
    variant: ConfirmVariant.Success,
  },
  discard: {
    title: "Discard Changes",
    message: "Unsaved changes will be lost. Proceed?",
    confirmText: "Discard",
    cancelText: "Cancel",
    variant: ConfirmVariant.Destructive,
  },
};
