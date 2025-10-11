"use client";

import { Form, Formik } from "formik";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SelectItem } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { FormInput } from "@/components/common/form-input";
import { FormSelect } from "@/components/common/form-select";
import { FormCheckbox } from "@/components/common/form-checkbox";
import { FormDatePicker } from "@/components/common/form-date-picker";
import React, { useMemo, useState } from "react";
import {
  combinedSchema,
  EmployeeFormValues,
  initialValues,
} from "@/app/(main)/features/employees/schemas/employee-schema";
import { Employee } from "@/app/(main)/features/employees/types/employee";
import { toEmployee, toEmployeeFormValues } from "@/app/(main)/features/employees/mappers/employee-mapper";
import { Role } from "@/app/(main)/features/access_control/types/role";

interface EmployeeFormProps {
  defaultValues?: Partial<Employee>;
  roles?: Role[];
  onSubmit?: (data: Employee) => Promise<void> | void;
  loading?: boolean;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ defaultValues, roles, onSubmit, loading = false }) => {
  const [showPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!defaultValues?.id;

  const formInitialValues: EmployeeFormValues = useMemo(() => {
    if (defaultValues) {
      return {
        ...initialValues,
        ...toEmployeeFormValues(defaultValues as Employee),
      };
    }
    return initialValues;
  }, [defaultValues]);

  const handleSubmit = async (data: EmployeeFormValues) => {
    try {
      const employeePayload = toEmployee(data);
      console.log(isEditMode ? "Updating Employee:" : "Creating Employee:", employeePayload);
      if (onSubmit) {
        await onSubmit(employeePayload);
      } else {
        console.log("Form Submitted:", JSON.stringify(employeePayload, null, 2));
      }
      setError(null);
    } catch (err) {
      console.error("Form submission error:", err);
      setError("Failed to submit the form. Please try again.");
    }
  };

  return (
    <div className="m-0 min-h-screen w-full p-0">
      <div className="w-full">
        <div className="space-y-2 py-4 text-center">
          <h1 className="text-2xl font-bold">{isEditMode ? "Edit Employee" : "Create Employee"}</h1>
          <p className="text-muted-foreground">
            {isEditMode ? "Update existing employee information" : "Add a new team member"}
          </p>
        </div>

        <Formik
          enableReinitialize
          initialValues={formInitialValues}
          validationSchema={combinedSchema}
          onSubmit={async (values, { setSubmitting }) => {
            await handleSubmit(values);
            setSubmitting(false);
          }}
        >
          {({ values, isSubmitting }) => (
            <Form className="w-full space-y-8">
              <input type="hidden" name="id" value={values.id ?? ""} />
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Alert className="w-full">
                <Info className="h-4 w-4" />
                <AlertDescription className="flex w-full items-center justify-between">
                  <span className="font-bold">Enable system access for this employee</span>
                  <FormCheckbox name="isUser" label="System User Access" />
                </AlertDescription>
              </Alert>

              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Employee details and contact info</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormInput name="firstName" label="First Name" placeholder="Enter first name" />
                    <FormInput name="middleName" label="Middle Name" placeholder="Enter middle name" />
                    <FormInput name="lastName" label="Last Name" placeholder="Enter last name" />
                    <FormInput name="email" label="Email" placeholder="employee@company.com" type="email" />
                    <FormInput name="phone" label="Phone" placeholder="+977 9864566828" />
                    <FormDatePicker name="dateOfBirth" label="Date of Birth" placeholder="YYYY-MM-DD" />
                    <FormDatePicker name="hireDate" label="Hire Date" placeholder="YYYY-MM-DD" />
                    <FormSelect name="gender" label="Gender" placeholder="Select gender">
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </FormSelect>
                    <FormSelect name="maritalStatus" label="Marital Status" placeholder="Select status">
                      <SelectItem value="SINGLE">Single</SelectItem>
                      <SelectItem value="MARRIED">Married</SelectItem>
                      <SelectItem value="DIVORCED">Divorced</SelectItem>
                      <SelectItem value="WIDOWED">Widowed</SelectItem>
                    </FormSelect>
                    <div className="flex items-center pt-8">
                      <FormCheckbox name="status" label="Active Employee" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {values.isUser && values.user && (
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>System Access</CardTitle>
                    <CardDescription>Configure login credentials</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <FormInput name="user.username" label="Username" placeholder="Enter username" />
                      <FormInput
                        name="user.password"
                        type={showPassword ? "text" : "password"}
                        label="Password"
                        placeholder="Enter password"
                      />
                      <FormInput
                        name="user.confirmPassword"
                        type={showPassword ? "text" : "password"}
                        label="Confirm Password"
                        placeholder="Re-enter password"
                      />
                      <FormSelect name="user.roleId" label="Role" placeholder="Select role">
                        {roles && roles.length > 0 ? (
                          roles.map((role) => (
                            <SelectItem key={role.id} value={role.id.toString()}>
                              {role.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="" disabled>
                            No roles available
                          </SelectItem>
                        )}
                      </FormSelect>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex w-full justify-end space-x-4 pt-6">
                <Button type="submit" size="lg" className="min-w-[150px]" disabled={isSubmitting || loading}>
                  {isSubmitting || loading ? (
                    <>
                      <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10" strokeWidth="4" opacity="0.3" />
                        <path d="M4 12a8 8 0 018-8" strokeWidth="4" />
                      </svg>
                      {isEditMode ? "Updating..." : "Saving..."}
                    </>
                  ) : isEditMode ? (
                    "Update Employee"
                  ) : (
                    "Save Employee"
                  )}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EmployeeForm;
