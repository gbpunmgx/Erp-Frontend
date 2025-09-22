import ApiClient from "@/lib/api/api-client";
import { ENDPOINTS } from "@/utils/endpoints";
import { ApiError } from "@/lib/api/api-error";
import { FeatureAction } from "@/app/(main)/features/access_control/types/eature-action";

class FeatureActionService {
  private api = ApiClient.getInstance();

  async getAll(): Promise<FeatureAction[]> {
    try {
      const res = await this.api.get<{ data: FeatureAction[]; message: string }>(ENDPOINTS.FEATURE_ACTION.GET_ALL);
      return res.data;
    } catch (error) {
      throw this.handleError(error, "Failed to fetch feature actions.");
    }
  }

  async getById(id: number): Promise<FeatureAction> {
    try {
      const res = await this.api.get<{ data: FeatureAction; message: string }>(
        `${ENDPOINTS.FEATURE_ACTION.GET_BY_ID}${id}`,
      );
      return res.data;
    } catch (error) {
      throw this.handleError(error, `Failed to fetch feature action with ID ${id}.`);
    }
  }

  async create(action: Omit<FeatureAction, "id" | "createdAt" | "updatedAt">): Promise<FeatureAction> {
    try {
      const res = await this.api.post<{ data: FeatureAction; message: string }>(
        ENDPOINTS.FEATURE_ACTION.CREATE,
        action,
      );
      return res.data;
    } catch (error) {
      throw this.handleError(error, "Failed to create feature action.");
    }
  }

  async update(id: number, action: Partial<FeatureAction>): Promise<FeatureAction> {
    try {
      const res = await this.api.put<{ data: FeatureAction; message: string }>(
        `${ENDPOINTS.FEATURE_ACTION.UPDATE}${id}`,
        action,
      );
      return res.data;
    } catch (error) {
      throw this.handleError(error, `Failed to update feature action with ID ${id}.`);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.api.delete(`${ENDPOINTS.FEATURE_ACTION.DELETE}${id}`);
    } catch (error) {
      throw this.handleError(error, `Failed to delete feature action with ID ${id}.`);
    }
  }

  private handleError(error: unknown, fallbackMessage: string): never {
    if (error instanceof ApiError) {
      throw error;
    }
    const errorMessage = error instanceof Error ? error.message : fallbackMessage;
    console.error("[FeatureActionService] Unexpected error:", error);
    throw new ApiError(0, errorMessage, { cause: error });
  }
}

export default new FeatureActionService();
