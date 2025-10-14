"use client";

import { LoginForm } from "@/components/ui/login-form";
import Lottie from "lottie-react";
import animationData from "@/animations/login.json";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      {/* Left side - Login Form */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="mb-6 flex justify-center gap-2 md:justify-start">
          <a href="#" className="font-medium">
            The Code Vibes
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <LoginForm />
        </div>
      </div>

      {/* Right side - Lottie Animation */}
      <div className="bg-muted relative hidden items-center justify-center p-12 lg:flex">
        <Lottie animationData={animationData} loop autoplay style={{ height: 400, width: 400 }} />
      </div>
    </div>
  );
}
