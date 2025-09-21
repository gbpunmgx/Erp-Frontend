"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Calendar as CalendarIconLucide,
  CalendarIcon,
  Edit,
  Heart,
  Phone,
  Plus,
  Trash2,
  User,
  Users,
} from "lucide-react";
import { Employee } from "@/app/(main)/features/employees/types/employee";

// ✅ Fixed Zod schema
const employeeSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 characters")
    .max(20, "Phone number must not exceed 20 characters"),
  dateOfBirth: z.date({
    required_error: "Date of birth is required",
    invalid_type_error: "Please select a valid date",
  }),
  hireDate: z.date({
    required_error: "Hire date is required",
    invalid_type_error: "Please select a valid date",
  }),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    required_error: "Please select a gender",
  }),
  maritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"], {
    required_error: "Please select marital status",
  }),
  userId: z.number().nullable().optional(),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface EmployeeDialogProps {
  employee?: Employee | null;
  mode: "create" | "update" | "delete";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Employee) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
  loading?: boolean;
}

const EmployeeDialog: React.FC<EmployeeDialogProps> = ({
  employee,
  mode,
  open,
  onOpenChange,
  onSubmit,
  onDelete,
  loading = false,
}) => {
  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: undefined,
      hireDate: undefined,
      gender: undefined,
      maritalStatus: undefined,
      userId: null,
    },
  });

  useEffect(() => {
    if (open) {
      if (employee && (mode === "update" || mode === "delete")) {
        form.reset({
          firstName: employee.firstName || "",
          lastName: employee.lastName || "",
          email: employee.email || "",
          phone: employee.phone || "",
          dateOfBirth: employee.dateOfBirth ? new Date(employee.dateOfBirth) : undefined,
          hireDate: employee.hireDate ? new Date(employee.hireDate) : undefined,
          gender: employee.gender,
          maritalStatus: employee.maritalStatus,
          userId: employee.userId,
        });
      } else if (mode === "create") {
        form.reset({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          dateOfBirth: undefined,
          hireDate: new Date(),
          gender: undefined,
          maritalStatus: undefined,
          userId: null,
        });
      }
    }
  }, [employee, mode, form, open]);

  const handleSubmit = async (data: EmployeeFormData) => {
    try {
      const employeeData: Employee = {
        ...data,
        id: employee?.id,
        dateOfBirth: data.dateOfBirth.toISOString().split("T")[0],
        hireDate: data.hireDate.toISOString().split("T")[0],
      };
      await onSubmit(employeeData);
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleDelete = async () => {
    if (employee?.id && onDelete) {
      try {
        await onDelete(employee.id);
        onOpenChange(false);
      } catch (error) {
        console.error("Error deleting employee:", error);
      }
    }
  };

  const getDialogTitle = () => {
    switch (mode) {
      case "create":
        return "Add New Employee";
      case "update":
        return "Edit Employee";
      case "delete":
        return "Delete Employee";
      default:
        return "Employee";
    }
  };

  const getDialogDescription = () => {
    switch (mode) {
      case "create":
        return "Fill in the information below to add a new employee to the system.";
      case "update":
        return "Update the employee information below.";
      case "delete":
        return "Are you sure you want to delete this employee? This action cannot be undone.";
      default:
        return "";
    }
  };

  const getDialogIcon = () => {
    switch (mode) {
      case "create":
        return <Plus className="h-5 w-5" />;
      case "update":
        return <Edit className="h-5 w-5" />;
      case "delete":
        return <Trash2 className="text-destructive h-5 w-5" />;
      default:
        return <User className="h-5 w-5" />;
    }
  };

  if (mode === "delete") {
    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {getDialogIcon()}
              Delete Employee
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {employee?.firstName} {employee?.lastName}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
              className="bg-destructive hover:bg-destructive/90"
            >
              {loading ? "Deleting..." : "Delete Employee"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] !w-[35vw] !max-w-[80vw] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getDialogIcon()}
            {getDialogTitle()}
          </DialogTitle>
          <DialogDescription>{getDialogDescription()}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Left Column */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter first name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter last name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Birth *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : "Select date"}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value ?? undefined}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maritalStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Heart className="h-4 w-4" />
                        Marital Status *
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value ?? undefined}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select marital status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="SINGLE">Single</SelectItem>
                          <SelectItem value="MARRIED">Married</SelectItem>
                          <SelectItem value="DIVORCED">Divorced</SelectItem>
                          <SelectItem value="WIDOWED">Widowed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} placeholder="Enter email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone Number *
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter phone number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hireDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="flex items-center gap-2">
                        <CalendarIconLucide className="h-4 w-4" />
                        Hire Date *
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : "Select hire date"}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        User ID (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            field.onChange(val ? Number(val) : null);
                          }}
                          placeholder="Enter user ID"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !form.formState.isValid}
                className={!form.formState.isValid ? "opacity-50" : ""}
              >
                {loading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-current" />
                    {mode === "create" ? "Creating..." : "Updating..."}
                  </>
                ) : (
                  <>
                    {getDialogIcon()}
                    {mode === "create" ? "Create Employee" : "Update Employee"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDialog;
