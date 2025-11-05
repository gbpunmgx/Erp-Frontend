import { Department } from "../types/department";

export function toDepartment(values: Department): Department {
  return {
    id: values.id,
    name: values.name.trim(),
    description: values.description?.trim() ?? "",
    location: values.location?.trim() ?? "",
    organizationId: Number(values.organizationId),
    branchId: Number(values.branchId),
  };
}
