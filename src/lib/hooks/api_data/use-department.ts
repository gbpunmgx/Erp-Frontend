import departmentService from "@/app/(main)/features/departments/api/department-service";
import { Department } from "@/app/(main)/features/departments/types/department";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function useDepartment() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await departmentService.getAll();
      setDepartments(data);
    } catch {
      toast.error("Failed to fetch departments. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  return { departments, loading, setDepartments, fetchDepartments };
}
