import { useField } from "formik";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import React from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
}

export const FormInput: React.FC<FormInputProps> = ({ label, className, ...props }) => {
  const [field, meta] = useField(props.name);

  return (
    <div className="space-y-1">
      {label && <Label htmlFor={props.name}>{label}</Label>}
      <Input
        {...field}
        id={props.name}
        type={props.type ?? "text"}
        placeholder={props.placeholder}
        className={cn(meta.touched && meta.error && "border-red-500 focus-visible:ring-red-500", className)}
      />
      {meta.touched && meta.error && <p className="mt-1 text-sm text-red-500">{meta.error}</p>}
    </div>
  );
};
