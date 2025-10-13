"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import authService, { LoginResponse } from "@/app/login/services/auth-service";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setUser } from "@/core/store/slices/auth-slice";
import { Card } from "./card";

interface LoginFormProps extends React.ComponentProps<"form"> {}

export function LoginForm({ className, ...props }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("superadmin");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const loginResponse: LoginResponse = await authService.login(username, password);
      dispatch(setUser(loginResponse));
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md p-8 sm:p-10 rounded-2xl shadow-lg bg-white dark:bg-gray-900">
      <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
        {/* Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Welcome Back</h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Enter your credentials to access your account
          </p>
        </div>

        {/* Error message */}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {/* Inputs */}
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="username" className="font-medium text-gray-700 dark:text-gray-200">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg shadow-sm"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password" className="font-medium text-gray-700 dark:text-gray-200">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          {/* Forgot password */}
          <div className="flex items-center justify-end">
            <a
              href="#"
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 underline transition-colors"
            >
              Forgot your password?
            </a>
          </div>
        </div>
      </form>
    </Card>
  );
}
