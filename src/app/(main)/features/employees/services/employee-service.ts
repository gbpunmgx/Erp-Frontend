import ApiClient from "@/lib/api/api-client";
import { ENDPOINTS } from "@/utils/endpoints";
import { Employee } from "@/app/(main)/features/employees/types/employee";
import { ApiError } from "@/lib/api/api-error";

class EmployeeService {
  private api = ApiClient.getInstance();

  async getAll(): Promise<Employee[]> {
    try {
      const res = await this.api.get<{ data: Employee[]; message: string }>(ENDPOINTS.EMPLOYEE.GET_ALL);
      return res.data;
    } catch (error) {
      throw this.handleError(error, "Failed to fetch employees.");
    }
  }

  async getById(id: number): Promise<Employee> {
    try {
      const res = await this.api.get<{ data: Employee; message: string }>(`${ENDPOINTS.EMPLOYEE.GET_BY_ID}${id}`);
      return res.data;
    } catch (error) {
      throw this.handleError(error, `Failed to fetch employee with ID ${id}.`);
    }
  }

  async create(employee: Employee): Promise<Employee> {
    try {
      const res = await this.api.post<{ data: Employee; message: string }>(ENDPOINTS.EMPLOYEE.CREATE, employee);
      return res.data;
    } catch (error) {
      throw this.handleError(error, "Failed to create employee.");
    }
  }

  async update(id: number, employee: Employee): Promise<Employee> {
    try {
      const res = await this.api.put<{ data: Employee; message: string }>(
        `${ENDPOINTS.EMPLOYEE.UPDATE}${id}`,
        employee,
      );
      return res.data;
    } catch (error) {
      throw this.handleError(error, `Failed to update employee with ID ${id}.`);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.api.delete(`${ENDPOINTS.EMPLOYEE.DELETE}${id}`);
    } catch (error) {
      throw this.handleError(error, `Failed to delete employee with ID ${id}.`);
    }
  }

  private handleError(error: unknown, fallbackMessage: string): never {
    if (error instanceof ApiError) {
      throw error;
    }
    const errorMessage = error instanceof Error ? error.message : fallbackMessage;
    console.error("[EmployeeService] Unexpected error:", error);
    throw new ApiError(0, errorMessage, { cause: error });
  }
}

const employeeService = new EmployeeService();

export default employeeService;
