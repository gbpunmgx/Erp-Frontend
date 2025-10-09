import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface FormFieldProps<T> {
  label: string;
  id: string;
  name: keyof T;
  type: string;
  value: T[keyof T];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
}

export function FormField<T>({
  label,
  id,
  name,
  type,
  value,
  onChange,
  error,
  required,
  placeholder,
}: FormFieldProps<T>) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className={error ? "text-destructive" : ""}>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Input
        type={type}
        id={id}
        name={name as string}
        value={value as string | number}
        onChange={onChange}
        placeholder={placeholder}
        className={error ? "border-destructive focus-visible:ring-destructive" : ""}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p id={`${id}-error`} className="text-destructive text-sm font-medium">
          {error}
        </p>
      )}
    </div>
  );
}
