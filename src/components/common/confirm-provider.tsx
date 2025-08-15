"use client";

import React, { createContext, ReactNode, useCallback, useContext, useState } from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { cn } from "@/lib/utils";
import { ConfirmType, GLOBAL_CONFIRM_CONFIGS } from "@/config/confirm-dialog.config";
import { ConfirmVariant } from "@/components/common/confirm-variant";

interface ConfirmOptionsPartial {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
}

type ConfirmInput = ConfirmType | ConfirmOptionsPartial;
type ConfirmContextType = (input: ConfirmInput) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmContextType | null>(null);

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within ConfirmProvider");
  }
  return context;
};

const baseClass = "inline-flex items-center justify-center rounded-md text-sm font-medium h-8 px-3 py-1";

const buttonVariants = ({ variant = ConfirmVariant.Default }: { variant?: ConfirmVariant }) => {
  const variants: Record<ConfirmVariant, string> = {
    [ConfirmVariant.Default]: `${baseClass} bg-primary text-primary-foreground hover:bg-primary/90`,
    // Destructive button: keep bg-destructive but text white now
    [ConfirmVariant.Destructive]: `${baseClass} bg-destructive text-white hover:bg-destructive/90`,
    [ConfirmVariant.Success]: `${baseClass} bg-green-600 text-white hover:bg-green-700`,
    [ConfirmVariant.Warning]: `${baseClass} bg-yellow-400 text-yellow-900 hover:bg-yellow-500`,
    [ConfirmVariant.Info]: `${baseClass} bg-blue-500 text-white hover:bg-blue-600`,
    [ConfirmVariant.Outline]: `${baseClass} border border-input bg-background hover:bg-accent hover:text-accent-foreground`,
    [ConfirmVariant.Secondary]: `${baseClass} bg-gray-200 text-gray-700 hover:bg-gray-300`,
    [ConfirmVariant.Ghost]: `${baseClass} hover:bg-accent hover:text-accent-foreground`,
    [ConfirmVariant.Link]: `${baseClass} underline-offset-4 hover:underline text-primary`,
    [ConfirmVariant.Disabled]: `${baseClass} bg-gray-400 text-white cursor-not-allowed`,
    [ConfirmVariant.Accent]: `${baseClass} bg-indigo-500 text-white hover:bg-indigo-600`,
    [ConfirmVariant.Neutral]: `${baseClass} bg-slate-500 text-white hover:bg-slate-600`,
  };
  return variants[variant];
};

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState(GLOBAL_CONFIRM_CONFIGS.delete);
  const [resolver, setResolver] = useState<(value: boolean) => void>(() => () => {});

  const confirm = useCallback<ConfirmContextType>((input) => {
    if (typeof input === "string") {
      setConfig(GLOBAL_CONFIRM_CONFIGS[input]);
    } else {
      setConfig({
        ...GLOBAL_CONFIRM_CONFIGS.delete,
        ...input,
      });
    }
    setIsOpen(true);
    return new Promise<boolean>((resolve) => {
      setResolver(() => resolve);
    });
  }, []);

  const handleConfirm = () => {
    setIsOpen(false);
    resolver(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
    resolver(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) handleCancel();
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}

      <AlertDialogPrimitive.Root open={isOpen} onOpenChange={handleOpenChange}>
        <AlertDialogPrimitive.Portal>
          <AlertDialogPrimitive.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50" />
          <AlertDialogPrimitive.Content
            className={cn(
              "bg-background fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border p-6 shadow-lg duration-200 sm:rounded-lg",
              "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
              "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
              "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
            )}
          >
            <div className="flex flex-col space-y-2 text-left">
              <AlertDialogPrimitive.Title className="text-lg font-semibold">{config.title}</AlertDialogPrimitive.Title>
              <AlertDialogPrimitive.Description className="text-muted-foreground text-sm">
                {config.message ?? "Are you sure you want to continue?"}
              </AlertDialogPrimitive.Description>
            </div>
            <div className="mt-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
              <AlertDialogPrimitive.Cancel
                className={cn(buttonVariants({ variant: ConfirmVariant.Default }))}
                onClick={handleCancel}
              >
                {config.cancelText ?? "Cancel"}
              </AlertDialogPrimitive.Cancel>
              <AlertDialogPrimitive.Action
                className={cn(buttonVariants({ variant: config.variant }))}
                onClick={handleConfirm}
              >
                {config.confirmText ?? "Confirm"}
              </AlertDialogPrimitive.Action>
            </div>
          </AlertDialogPrimitive.Content>
        </AlertDialogPrimitive.Portal>
      </AlertDialogPrimitive.Root>
    </ConfirmContext.Provider>
  );
}
