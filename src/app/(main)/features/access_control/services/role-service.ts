import ApiClient from "@/lib/api/api-client";
import { ENDPOINTS } from "@/utils/endpoints";
import { ApiError } from "@/lib/api/api-error";
import { Role } from "@/app/(main)/features/access_control/types/role";

class RoleService {
  private api = ApiClient.getInstance();

  async getAll(): Promise<Role[]> {
    try {
      const res = await this.api.get<{ data: Role[]; message: string }>(ENDPOINTS.ROLE.GET_ALL);
      return res.data;
    } catch (error) {
      throw this.handleError(error, "Failed to fetch roles.");
    }
  }

  async getById(id: number): Promise<Role> {
    try {
      const res = await this.api.get<{ data: Role; message: string }>(`${ENDPOINTS.ROLE.GET_BY_ID}/${id}`);
      return res.data;
    } catch (error) {
      throw this.handleError(error, `Failed to fetch role with ID ${id}.`);
    }
  }

  async create(role: Omit<Role, "id" | "createdAt" | "updatedAt">): Promise<Role> {
    try {
      const res = await this.api.post<{ data: Role; message: string }>(ENDPOINTS.ROLE.CREATE, role);
      return res.data;
    } catch (error) {
      throw this.handleError(error, "Failed to create role.");
    }
  }

  async update(id: number, role: Partial<Role>): Promise<Role> {
    try {
      const res = await this.api.put<{ data: Role; message: string }>(`${ENDPOINTS.ROLE.UPDATE}${id}`, role);
      return res.data;
    } catch (error) {
      throw this.handleError(error, `Failed to update role with ID ${id}.`);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.api.delete(`${ENDPOINTS.ROLE.DELETE}${id}`);
    } catch (error) {
      throw this.handleError(error, `Failed to delete role with ID ${id}.`);
    }
  }

  private handleError(error: unknown, fallbackMessage: string): never {
    if (error instanceof ApiError) {
      throw error;
    }
    const errorMessage = error instanceof Error ? error.message : fallbackMessage;
    console.error("[RoleService] Unexpected error:", error);
    throw new ApiError(0, errorMessage, { cause: error });
  }
}

export default new RoleService();
