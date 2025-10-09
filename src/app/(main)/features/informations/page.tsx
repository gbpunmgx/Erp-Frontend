"use client";

import React, { useState } from "react";
import { FormField } from "@/components/common/form-field";
import { DropdownField } from "@/components/common/dropdown-field";
import * as yup from "yup";
import { FormErrors, UserFormData } from "@/app/(main)/features/informations/types";
import { userSchema } from "@/app/(main)/features/informations/user-schema";

export default function ValidationForm() {
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    age: "",
    password: "",
    confirmPassword: "",
    website: "",
    role: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value ? Number(value) : "") : value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(false);

    try {
      await userSchema.validate(formData, { abortEarly: false });
      setErrors({});
      setSubmitted(true);
      console.log("Form data:", formData);

      setFormData({
        name: "",
        email: "",
        age: "",
        password: "",
        confirmPassword: "",
        website: "",
        role: "",
      });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const newErrors: FormErrors = {};
        error.inner.forEach((err) => {
          if (err.path) newErrors[err.path as keyof FormErrors] = err.message;
        });
        setErrors(newErrors);
      }
    }
  };

  const ageOptions = Array.from({ length: 100 }, (_, i) => ({
    label: (i + 1).toString(),
    value: (i + 1).toString(),
  }));

  const roleOptions = [
    { label: "Admin", value: "admin" },
    { label: "Manager", value: "manager" },
    { label: "User", value: "user" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">User Registration Form</h1>

        {submitted && (
          <div className="mb-4 rounded border border-green-400 bg-green-100 p-4 text-green-700">
            Form submitted successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField<UserFormData>
            label="Name"
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
          />

          <FormField<UserFormData>
            label="Email"
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />

          <DropdownField<UserFormData>
            label="Age"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            options={ageOptions}
            error={errors.age}
            required
          />

          <FormField<UserFormData>
            label="Password"
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />

          <FormField<UserFormData>
            label="Age"
            id="age"
            name="age"
            type="text"
            value={formData.age}
            onChange={handleChange}
            error={errors.age}
            required
          />

          <FormField<UserFormData>
            label="Website (Optional)"
            id="website"
            name="website"
            type="text"
            value={formData.website ?? ""}
            onChange={handleChange}
            error={errors.website}
            placeholder="https://example.com"
          />
          <DropdownField<UserFormData>
            label="User Role"
            id="role"
            name="role"
            value={formData.role ?? ""}
            onChange={handleChange}
            options={roleOptions}
            error={errors.role}
            required
            allowUnselect={true}
          />

          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
