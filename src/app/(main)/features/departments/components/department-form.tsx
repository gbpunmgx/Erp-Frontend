"use client";

import React, { useState } from "react";
import { Formik, Form } from "formik";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/common/form-input";
import { departmentSchema, initialValues } from "../schemas/department-schema";
import { Department } from "../types/department";
import { toDepartment } from "../mappers/department-mapper";

interface DepartmentFormProps {
  defaultValues?: Partial<Department>;
  onSubmit?: (data: Department) => Promise<void> | void;
  loading?: boolean;
}

export default function DepartmentForm({ defaultValues, onSubmit, loading = false }: DepartmentFormProps) {
  const isEditMode = !!defaultValues?.id;
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: Department) => {
    try {
      const payload = toDepartment(data);
      if (onSubmit) await onSubmit(payload);
      setError(null);
    } catch (err) {
      console.error("Submit error:", err);
      setError("Failed to submit department form.");
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? "Edit Department" : "Create Department"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Formik
            enableReinitialize
            initialValues={{ ...initialValues, ...defaultValues }}
            validationSchema={departmentSchema}
            onSubmit={async (values, { setSubmitting }) => {
              await handleSubmit(values);
              setSubmitting(false);
            }}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <FormInput name="name" label="Department Name" placeholder="Enter department name" />
                <FormInput name="description" label="Description" placeholder="Enter description" />
                <FormInput name="location" label="Location" placeholder="Enter location" />
                <FormInput name="organizationId" label="Organization ID" type="number" />
                <FormInput name="branchId" label="Branch ID" type="number" />

                {error && <p className="text-sm text-red-500">{error}</p>}

                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={isSubmitting || loading}>
                    {isSubmitting || loading ? "Saving..." : isEditMode ? "Update" : "Create"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
}
