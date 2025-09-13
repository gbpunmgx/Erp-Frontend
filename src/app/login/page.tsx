"use client";
import { LoginForm } from "@/components/ui/login-form";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="items-right flex gap-2 font-medium">
            The Code Vibes
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <LoginForm />
        </div>
      </div>
      <div className="bg-muted relative hidden items-center justify-center p-12 lg:flex">
        <img src="/next.svg" alt="Image" className="object-contain dark:brightness-[0.2] dark:grayscale" />
      </div>
    </div>
  );
}
