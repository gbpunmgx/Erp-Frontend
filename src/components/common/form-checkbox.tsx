import { useField } from "formik";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import React from "react";

interface FormCheckboxProps {
  name: string;
  label: string;
}

export const FormCheckbox: React.FC<FormCheckboxProps> = ({ label, ...props }) => {
  const [field, meta] = useField({ ...props, type: "checkbox" });

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={props.name}
        checked={field.value}
        onCheckedChange={(checked) => field.onChange({ target: { name: props.name, value: checked } })}
        className={meta.touched && meta.error ? "border-red-500" : ""}
      />
      <Label htmlFor={props.name}>{label}</Label>
      {meta.touched && meta.error && <p className="text-sm text-red-500">{meta.error}</p>}
    </div>
  );
};
