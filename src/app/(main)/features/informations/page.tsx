"use client";

import { Formik, Form } from "formik";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SelectItem } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { combinedSchema, EmployeeFormValues, initialValues } from "./user-schema";
import { FormInput } from "@/components/common/form-input";
import { FormSelect } from "@/components/common/form-select";
import { FormCheckbox } from "@/components/common/form-checkbox";
import { FormDatePicker } from "@/components/common/form-date-picker";

export default function EmployeeFormPage() {
  return (
    <div className="m-0 min-h-screen w-full p-0">
      <div className="w-full">
        <div className="space-y-2 py-8 text-center">
          <h1 className="text-2xl font-bold">Create Employee</h1>
          <p className="text-muted-foreground">Add a new team member</p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={combinedSchema}
          onSubmit={(values: EmployeeFormValues, { setSubmitting }) => {
            console.log("Form Submitted:", values);
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              setSubmitting(false);
            }, 500);
          }}
        >
          {({ values, isSubmitting }) => (
            <Form className="w-full space-y-8">
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
                    <FormInput name="phone" label="Phone" placeholder="+1 (555) 000-0000" />
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
                      <FormInput name="user.password" type="password" label="Password" placeholder="Enter password" />

                      <FormInput
                        name="user.confirmPassword"
                        type="password"
                        label="Confirm Password"
                        placeholder="Enter password"
                      />
                      <FormSelect name="user.roleId" label="Role" placeholder="Select role">
                        <SelectItem value={"1"}>Admin</SelectItem>
                        <SelectItem value={"2"}>User</SelectItem>
                        <SelectItem value={"3"}>Guest</SelectItem>
                      </FormSelect>
                      <div className="flex items-center pt-8">
                        <FormCheckbox name="user.status" label="Account Active" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex w-full justify-end space-x-4 pt-6">
                <Button type="submit" size="lg" className="min-w-[150px]" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Employee"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
