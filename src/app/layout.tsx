/* eslint-disable import/order */
import { ReactNode } from "react";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ThemeProvider } from "next-themes";

import { APP_CONFIG } from "@/config/app-config";

import "./globals.css";
import { ConfirmProvider } from "@/components/common/confirm-provider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: APP_CONFIG.meta.title,
  description: APP_CONFIG.meta.description,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange enableSystem={false}>
          <ConfirmProvider>{children}</ConfirmProvider>
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
