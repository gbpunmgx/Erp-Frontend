"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, Eye, EyeOff, Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ApiError } from "@/lib/api/api-error";
import { combinedSchema, roles } from "../schemas/employee-schema";
import EmployeeService from "@/app/(main)/features/employees/services/employee-service";
import { toast } from "sonner";
import { Employee } from "@/app/(main)/features/employees/types/employee";
import { data } from "browserslist";

interface EmployeeFormProps {
  defaultValues?: Partial<FormData>;
  onSubmit?: (data: FormData) => void;
  loading?: boolean;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ defaultValues, onSubmit, loading = false }) => {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormData>({
    resolver: yupResolver(combinedSchema),
    mode: "onSubmit",
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      hireDate: "",
      gender: "MALE", // matches type
      maritalStatus: "SINGLE", // matches type
      status: true,
      isUser: false,
      user: {
        username: "",
        password: "",
        roleId: roles[0].id,
        organizationId: 1, // default value
        branchId: 1, // default value
        status: true,
      },
      ...defaultValues,
    },
  });

  const handleSubmit = async (data: FormData) => {
    console.log("handleSubmit called", data);

    const user = data.isUser
      ? {
          ...data.user,
          organizationId: 1,
          branchId: 1,
          roleId: 1,
        }
      : undefined;

    const submitData: Employee = { ...data, user };

    try {
      if (defaultValues?.id) {
        await EmployeeService.update(defaultValues.id, submitData);
        console.log("Employee updated successfully", submitData);
      } else {
        await EmployeeService.create(submitData);
        console.log("Employee created successfully", submitData);
      }

      onSubmit?.(submitData);
      form.reset(defaultValues ?? {}); // reset form to default values
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  const watchIsUser = form.watch("isUser");

  return (
    <div className="m-0 min-h-screen w-full p-0">
      <div className="w-full">
        <div className="space-y-2 py-8 text-center">
          <h1 className="text-2xl font-bold">{defaultValues ? "Edit Employee" : "Create Employee"}</h1>
          <p className="text-muted-foreground">{defaultValues ? "Update employee details" : "Add a new team member"}</p>
        </div>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              console.log("Form submission triggered"); // Debug log
              form.handleSubmit(handleSubmit)(e);
            }}
            className="w-full space-y-8"
          >
            <Alert className="w-full">
              <Info className="h-4 w-4" />
              <AlertDescription className="flex w-full items-center justify-between">
                <span className="font-bold">Enable system access for this employee</span>
                <FormField
                  control={form.control}
                  name="isUser"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="cursor-pointer">System User Access</FormLabel>
                    </FormItem>
                  )}
                />
              </AlertDescription>
            </Alert>
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Employee details and contact info</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="First Name" className="h-11 px-3 py-2 text-base" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="middleName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Middle Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Middle Name" className="h-11 px-3 py-2 text-base" />
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
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Last Name" className="h-11 px-3 py-2 text-base" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Email" className="h-11 px-3 py-2 text-base" />
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
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Phone" className="h-11 px-3 py-2 text-base" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button variant="outline" className="h-11 w-full justify-start text-left text-base">
                                {field.value ? format(new Date(field.value), "yyyy-MM-dd") : "Select date"}
                                <CalendarIcon className="ml-auto h-4 w-4" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value ? new Date(field.value) : undefined}
                              onSelect={(date) => {
                                if (date) field.onChange(format(date, "yyyy-MM-dd"));
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hireDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hire Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button variant="outline" className="h-11 w-full justify-start text-left text-base">
                                {field.value ? format(new Date(field.value), "yyyy-MM-dd") : "Select date"}
                                <CalendarIcon className="ml-auto h-4 w-4" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value ? new Date(field.value) : undefined}
                              onSelect={(date) => {
                                if (date) field.onChange(format(date, "yyyy-MM-dd"));
                              }}
                              initialFocus
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
                        <FormLabel>Gender</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="h-11 w-full px-3 py-2 text-base">
                              <SelectValue placeholder="Select Gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="MALE">Male</SelectItem>
                              <SelectItem value="FEMALE">Female</SelectItem>
                              <SelectItem value="OTHER">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="maritalStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marital Status</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="h-11 w-full px-3 py-2 text-base">
                              <SelectValue placeholder="Select Marital Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="SINGLE">Single</SelectItem>
                              <SelectItem value="MARRIED">Married</SelectItem>
                              <SelectItem value="DIVORCED">Divorced</SelectItem>
                              <SelectItem value="WIDOWED">Widowed</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox checked={field.value} {...field} />
                        </FormControl>
                        <FormLabel>Active</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {watchIsUser && (
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>System Access</CardTitle>
                  <CardDescription>Configure login credentials</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="user.username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Username" className="h-11 px-3 py-2 text-base" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="user.password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="h-11 px-3 py-2 pr-10 text-base"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute top-1/2 right-1 -translate-y-1/2 px-2"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <EyeOff /> : <Eye />}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="user.roleId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Role <span className="text-red-500">*</span>
                        </FormLabel>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          {roles.map((role) => {
                            const Icon = role.icon;
                            const isSelected = field.value === role.id;
                            return (
                              <div
                                key={role.id}
                                className={cn(
                                  "flex cursor-pointer items-center space-x-3 rounded-lg border p-4",
                                  isSelected ? "border-primary bg-primary/5" : "border-border",
                                )}
                                onClick={() => field.onChange(role.id)}
                              >
                                <div className={cn("rounded-full p-2", isSelected ? role.color : "bg-muted")}>
                                  <Icon className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium">{role.name}</h4>
                                  <p className="text-muted-foreground text-sm">{role.description}</p>
                                </div>
                                {isSelected && <Badge>Selected</Badge>}
                              </div>
                            );
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}
            <div className="flex w-full justify-end space-x-4 pt-6">
              <Button
                type="submit"
                size="lg"
                className="min-w-[150px]"
                disabled={loading || form.formState.isSubmitting}
              >
                {loading || form.formState.isSubmitting
                  ? "Saving..."
                  : defaultValues
                    ? "Update Employee"
                    : "Save Employee"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EmployeeForm;
