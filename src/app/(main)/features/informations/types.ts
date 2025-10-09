export interface UserFormData {
  name: string;
  email: string;
  age: number | string;
  password: string;
  confirmPassword: string;
  website?: string;
  role?: string;
}

export type FormErrors = Partial<Record<keyof UserFormData, string>>;
