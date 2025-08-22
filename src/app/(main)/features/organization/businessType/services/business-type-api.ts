import ApiClient from "@/lib/api/api-client";
import { BusinessTypeBase, BusinessTypeWithId } from "../types/business-type";
import { ApiResponseList } from "@/core/entities/api-response-list";
import { ApiResponseSingle } from "@/core/entities/api-response-single";
import { ENDPOINTS } from "@/utils/endpoints";

const apiClient = ApiClient.getInstance();

const transformBusinessType = (data: unknown): BusinessTypeWithId => {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid business type data: Expected an object");
  }

  const { id, name, description } = data as Record<string, unknown>;

  if (typeof id !== "number") {
    throw new Error("Invalid business type data: ID must be a number");
  }
  if (typeof name !== "string" || !name.trim()) {
    throw new Error("Invalid business type data: Name must be a non-empty string");
  }
  if (description !== undefined && typeof description !== "string") {
    throw new Error("Invalid business type data: Description must be a string if provided");
  }

  return { id, name, description: description ?? "" } as BusinessTypeWithId;
};

export const getAllBusinessTypes = async (): Promise<BusinessTypeWithId[]> => {
  try {
    const json = await apiClient.get(ENDPOINTS.CUSTOMERS.LIST);
    const response = ApiResponseList.fromJson<BusinessTypeWithId>(
      json as Record<string, unknown>,
      transformBusinessType,
    );
    return response.getResult();
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? `Failed to fetch business types: ${error.message}`
        : "Failed to fetch business types: Unknown error";
    throw new Error(errorMessage);
  }
};

export const getBusinessTypeById = async (id: number): Promise<BusinessTypeWithId> => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid ID: Must be a positive integer");
  }

  try {
    const json = await apiClient.get(`${ENDPOINTS.CUSTOMERS.LIST}/${id}`);
    const response = ApiResponseSingle.fromJson<BusinessTypeWithId>(
      json as Record<string, unknown>,
      transformBusinessType,
    );
    return response.getResult();
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? `Failed to fetch business type with ID ${id}: ${error.message}`
        : `Failed to fetch business type with ID ${id}: Unknown error`;
    throw new Error(errorMessage);
  }
};

export const createBusinessType = async (businessType: BusinessTypeBase): Promise<BusinessTypeBase> => {
  if (!businessType || !businessType.name) {
    throw new Error("Invalid business type data: Name is required");
  }

  try {
    const json = await apiClient.post(ENDPOINTS.CUSTOMERS.LIST, businessType);
    const response = ApiResponseSingle.fromJson<BusinessTypeBase>(
      json as Record<string, unknown>,
      transformBusinessType,
    );
    return response.getResult();
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? `Failed to create business type: ${error.message}`
        : "Failed to create business type: Unknown error";
    throw new Error(errorMessage);
  }
};

export const updateBusinessType = async (businessType: BusinessTypeWithId): Promise<BusinessTypeWithId> => {
  if (!businessType || !businessType.id || !businessType.name) {
    throw new Error("Invalid business type data: ID and name are required");
  }

  try {
    const json = await apiClient.put(`${ENDPOINTS.CUSTOMERS.LIST}/${businessType.id}`, businessType);
    const response = ApiResponseSingle.fromJson<BusinessTypeWithId>(
      json as Record<string, unknown>,
      transformBusinessType,
    );
    return response.getResult();
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? `Failed to update business type with ID ${businessType.id}: ${error.message}`
        : `Failed to update business type with ID ${businessType.id}: Unknown error`;
    throw new Error(errorMessage);
  }
};

export const deleteBusinessType = async (id: number): Promise<void> => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid ID: Must be a positive integer");
  }

  try {
    await apiClient.delete(`${ENDPOINTS.CUSTOMERS.LIST}/${id}`);
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? `Failed to delete business type with ID ${id}: ${error.message}`
        : `Failed to delete business type with ID ${id}: Unknown error`;
    throw new Error(errorMessage);
  }
};
