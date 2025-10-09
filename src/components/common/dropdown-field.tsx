import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownFieldProps<T> {
  label: string;
  id: string;
  name: keyof T;
  value: T[keyof T];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  options: DropdownOption[];
  error?: string;
  required?: boolean;
  placeholder?: string;
  allowUnselect?: boolean;
}

export const DropdownField = <T,>({
  label,
  id,
  name,
  value,
  onChange,
  options,
  error,
  required,
  placeholder = "Select...",
  allowUnselect = false,
}: DropdownFieldProps<T>) => {
  const handleValueChange = (selectedValue: string) => {
    const convertedValue: string | number | "" =
      selectedValue === "__none__" ? "" : typeof value === "number" ? Number(selectedValue) : selectedValue;

    const syntheticEvent = {
      target: { name: name as string, value: convertedValue },
    } as React.ChangeEvent<HTMLInputElement>;

    onChange(syntheticEvent);
  };

  return (
    <div className="w-full space-y-2">
      <Label htmlFor={id} className={error ? "text-destructive" : ""}>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>

      <Select value={value === "" ? "__none__" : String(value)} onValueChange={handleValueChange}>
        <SelectTrigger
          id={id}
          className={`w-full ${error ? "border-destructive focus:ring-destructive" : ""}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent className="w-full">
          {allowUnselect && <SelectItem value="__none__">{placeholder}</SelectItem>}
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {error && (
        <p id={`${id}-error`} className="text-destructive text-sm font-medium">
          {error}
        </p>
      )}
    </div>
  );
};
