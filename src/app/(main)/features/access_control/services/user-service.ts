import ApiClient from "@/lib/api/api-client";
import { ENDPOINTS } from "@/utils/endpoints";
import { ApiError } from "@/lib/api/api-error";
import { User } from "@/app/(main)/features/access_control/types/user";

class UserService {
  private api = ApiClient.getInstance();

  async getAll(): Promise<User[]> {
    try {
      const res = await this.api.get<{ data: User[]; message: string }>(ENDPOINTS.USER.GET_ALL);
      return res.data;
    } catch (error) {
      throw this.handleError(error, "Failed to fetch users.");
    }
  }

  async getById(id: number): Promise<User> {
    try {
      const res = await this.api.get<{ data: User; message: string }>(`${ENDPOINTS.USER.GET_BY_ID}${id}`);
      return res.data;
    } catch (error) {
      throw this.handleError(error, `Failed to fetch user with ID ${id}.`);
    }
  }

  async create(user: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    try {
      const res = await this.api.post<{ data: User; message: string }>(ENDPOINTS.USER.CREATE, user);
      return res.data;
    } catch (error) {
      throw this.handleError(error, "Failed to create user.");
    }
  }

  async update(id: number, user: Partial<User>): Promise<User> {
    try {
      const res = await this.api.put<{ data: User; message: string }>(`${ENDPOINTS.USER.UPDATE}${id}`, user);
      return res.data;
    } catch (error) {
      throw this.handleError(error, `Failed to update user with ID ${id}.`);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.api.delete(`${ENDPOINTS.USER.DELETE}${id}`);
    } catch (error) {
      throw this.handleError(error, `Failed to delete user with ID ${id}.`);
    }
  }

  private handleError(error: unknown, fallbackMessage: string): never {
    if (error instanceof ApiError) {
      throw error;
    }
    const errorMessage = error instanceof Error ? error.message : fallbackMessage;
    console.error("[UserService] Unexpected error:", error);
    throw new ApiError(0, errorMessage, { cause: error });
  }
}

export default new UserService();
