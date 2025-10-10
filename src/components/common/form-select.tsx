import { useField } from "formik";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import React from "react";

interface FormSelectProps {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  children: React.ReactNode;
}

export const FormSelect: React.FC<FormSelectProps> = ({ label, placeholder, className, children, ...props }) => {
  const [field, meta, helpers] = useField(props.name);

  const handleValueChange = (value: string) => {
    helpers.setValue(value === "none" ? "" : value);
    helpers.setTouched(true);
  };

  return (
    <div className="space-y-1">
      {label && <Label htmlFor={props.name}>{label}</Label>}
      <Select onValueChange={handleValueChange} value={field.value ?? ""}>
        <SelectTrigger
          id={props.name}
          className={cn("w-full", meta.touched && meta.error && "border-red-500 focus-visible:ring-red-500", className)}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None</SelectItem>
          {children}
        </SelectContent>
      </Select>
      {meta.touched && meta.error && <p className="mt-1 text-sm text-red-500">{meta.error}</p>}
    </div>
  );
};
