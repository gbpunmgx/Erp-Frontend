"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/core/store";
import { ThemeProvider } from "next-themes";
import { ConfirmProvider } from "@/components/common/confirm-provider";
import { Toaster } from "sonner";
import { SidebarProvider } from "@/components/ui/sidebar";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange enableSystem={false}>
        <ConfirmProvider>
          <SidebarProvider>
            {children}
            <Toaster position="bottom-right" richColors />
          </SidebarProvider>
        </ConfirmProvider>
      </ThemeProvider>
    </Provider>
  );
}
