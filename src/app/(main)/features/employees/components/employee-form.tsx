"use client";

import React, { useState } from "react";
import { useForm, ControllerRenderProps } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { Info, EyeOff, Eye } from "lucide-react";
import { combinedSchema, FormData, roles } from "../schemas/employee-schema";

interface EmployeeFormProps {
  defaultValues?: Partial<FormData>;
  onSubmit?: (data: FormData) => void;
  loading?: boolean;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  defaultValues,
  onSubmit = (data) => console.log(data),
  loading = false,
}) => {
  const [isUser, setIsUser] = useState(defaultValues?.isUser ?? false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormData>({
    resolver: yupResolver(combinedSchema),
    mode: "onSubmit",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      gender: "",
      maritalStatus: "",
      isUser: false,
      user: { username: "", email: "", password: "", roleId: undefined },
      ...defaultValues,
    },
  });

  const handleSubmit = (data: FormData) => {
    const submitData = { ...data, isUser, user: isUser ? data.user : undefined };
    onSubmit(submitData);
  };

  const watchIsUser = form.watch("isUser");

  return (
    <div className="m-0 min-h-screen w-full p-0">
      <div className="w-full">
        <div className="space-y-2 py-8 text-center">
          <h1 className="text-2xl font-bold">Create Employee</h1>
          <p className="text-muted-foreground">Add a new team member to your organization</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full space-y-8">
            \{" "}
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
                        <Checkbox
                          checked={field.value ?? isUser}
                          onCheckedChange={(checked) => {
                            field.onChange(!!checked);
                            setIsUser(!!checked);
                          }}
                        />
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
                          <Input {...field} placeholder="First Name" className="h-11" />
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
                          <Input {...field} placeholder="Last Name" className="h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Email" className="h-11" />
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
                          <Input {...field} placeholder="Phone" className="h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            {(isUser ?? watchIsUser) && (
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
                            <Input {...field} placeholder="Username" className="h-11" />
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
                                className="h-11 pr-10"
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
                        <FormLabel>Role</FormLabel>
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
              <Button type="submit" size="lg" className="min-w-[150px]">
                {loading ? "Saving..." : "Save Employee"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EmployeeForm;
