import { useForm, UseFormProps, UseFormReturn } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

export const useYupForm = <T extends yup.AnyObjectSchema>(
  schema: T,
  options?: UseFormProps<yup.InferType<T>>,
): UseFormReturn<yup.InferType<T>> => {
  return useForm<yup.InferType<T>>({
    resolver: yupResolver(schema),
    ...options,
  });
};
