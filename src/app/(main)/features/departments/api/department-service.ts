import ApiClient from "@/lib/api/api-client";
import { ENDPOINTS } from "@/utils/endpoints";
import { ApiError } from "@/lib/api/api-error";
import { Department } from "../types/department";

class DepartmentService {
  private api = ApiClient.getInstance();

  async getAll(): Promise<Department[]> {
    try {
      const res = await this.api.get<{ data: Department[]; message: string }>(ENDPOINTS.DEPARTMENT.GET_ALL);
      return res.data;
    } catch (error) {
      throw this.handleError(error, "Failed to fetch departments.");
    }
  }

  async getById(id: number): Promise<Department> {
    try {
      const res = await this.api.get<{ data: Department; message: string }>(`${ENDPOINTS.DEPARTMENT.GET_BY_ID}${id}`);
      return res.data;
    } catch (error) {
      throw this.handleError(error, `Failed to fetch department with ID ${id}.`);
    }
  }

  async create(department: Department): Promise<Department> {
    try {
      const res = await this.api.post<{ data: Department; message: string }>(ENDPOINTS.DEPARTMENT.CREATE, department);
      return res.data;
    } catch (error) {
      throw this.handleError(error, "Failed to create department.");
    }
  }

  async update(id: number, department: Department): Promise<Department> {
    try {
      const res = await this.api.put<{ data: Department; message: string }>(
        `${ENDPOINTS.DEPARTMENT.UPDATE}${id}`,
        department,
      );
      return res.data;
    } catch (error) {
      throw this.handleError(error, `Failed to update department with ID ${id}.`);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.api.delete(`${ENDPOINTS.DEPARTMENT.DELETE}${id}`);
    } catch (error) {
      throw this.handleError(error, `Failed to delete department with ID ${id}.`);
    }
  }

  private handleError(error: unknown, fallbackMessage: string): never {
    if (error instanceof ApiError) throw error;
    const message = error instanceof Error ? error.message : fallbackMessage;
    console.error("[DepartmentService] Unexpected error:", error);
    throw new ApiError(0, message, { cause: error });
  }
}

const departmentService = new DepartmentService();
export default departmentService;
