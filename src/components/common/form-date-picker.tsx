import { useField } from "formik";
import { format, parse } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";

interface FormDatePickerProps {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  defaultValue?: string;
}

export const FormDatePicker: React.FC<FormDatePickerProps> = ({
  label,
  placeholder = "yyyy-MM-dd",
  className,
  defaultValue,
  ...props
}) => {
  const [field, meta, helpers] = useField(props.name);

  const [inputValue, setInputValue] = useState<string>(
    field.value ? format(field.value, "yyyy-MM-dd") : (defaultValue ?? ""),
  );

  useEffect(() => {
    if (!field.value && defaultValue) {
      const parsed = parse(defaultValue, "yyyy-MM-dd", new Date());
      if (!isNaN(parsed.getTime())) {
        helpers.setValue(parsed);
      }
    }
  }, [defaultValue, field.value, helpers]);

  const formatInput = (value: string): string => {
    const cleaned = value.replace(/[^0-9]/g, "");
    const year = cleaned.slice(0, 4);
    let month = cleaned.slice(4, 6);
    if (month.length === 2) {
      const monthNum = parseInt(month, 10);
      if (monthNum > 12) month = "12";
      if (monthNum < 1) month = "01";
    }
    let day = cleaned.slice(6, 8);
    if (day.length === 2 && month.length === 2 && year.length === 4) {
      const yearNum = parseInt(year, 10);
      const monthNum = parseInt(month, 10);
      const dayNum = parseInt(day, 10);

      const maxDay = new Date(yearNum, monthNum, 0).getDate();
      if (dayNum > maxDay) day = String(maxDay).padStart(2, "0");
      if (dayNum < 1) day = "01";
    }

    let formatted = year;
    if (month) formatted += "-" + month;
    if (day) formatted += "-" + day;

    return formatted.slice(0, 10);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formattedValue = formatInput(rawValue);
    setInputValue(formattedValue);

    if (formattedValue.length === 10) {
      try {
        const parsedDate = parse(formattedValue, "yyyy-MM-dd", new Date());
        if (isNaN(parsedDate.getTime())) {
          helpers.setValue("");
        } else {
          helpers.setValue(formattedValue);
          helpers.setTouched(true);
        }
      } catch {
        helpers.setValue("");
      }
    } else {
      helpers.setValue("");
    }
  };

  const handleSelect = (date: Date | undefined) => {
    helpers.setTouched(true);
    if (date) {
      const formatted = format(date, "yyyy-MM-dd");
      helpers.setValue(formatted);
      setInputValue(formatted);
    } else {
      helpers.setValue("");
      setInputValue("");
    }
  };

  return (
    <div className="space-y-1">
      {label && <Label htmlFor={props.name}>{label}</Label>}
      <div className="relative">
        <Popover>
          <PopoverTrigger asChild>
            <div className="relative">
              <Input
                id={props.name}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder={placeholder}
                className={cn(
                  "w-full pr-10",
                  meta.touched && meta.error && "border-red-500 focus-visible:ring-red-500",
                  className,
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-0 right-0 h-full px-3"
                onClick={(e) => e.preventDefault()}
              >
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={field.value} onSelect={handleSelect} initialFocus {...props} />
          </PopoverContent>
        </Popover>
      </div>
      {meta.touched && meta.error && <p className="mt-1 text-sm text-red-500">{meta.error}</p>}
    </div>
  );
};
