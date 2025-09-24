import { useEffect, useState, useCallback } from "react";
import { Employee } from "@/app/(main)/features/employees/types/employee";
import EmployeeService from "@/app/(main)/features/employees/services/employee-service";
import { toast } from "sonner";

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const data = await EmployeeService.getAll();
      setEmployees(data);
    } catch {
      toast.error("Failed to fetch employees. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees().then((r) => {});
  }, [fetchEmployees]);

  return { employees, loading, setEmployees, fetchEmployees };
}
