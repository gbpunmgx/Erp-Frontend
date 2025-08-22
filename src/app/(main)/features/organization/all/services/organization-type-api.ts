import ApiClient from "@/lib/api/api-client";
import { ApiResponseList } from "@/core/entities/api-response-list";
import { ApiResponseSingle } from "@/core/entities/api-response-single";
import { OrganizationBase, OrganizationWithId } from "@/app/(main)/features/organization/all/types/organization-type";
import { ENDPOINTS } from "@/utils/endpoints";

const apiClient = ApiClient.getInstance();

const transformOrganization = (data: unknown): OrganizationWithId => {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid organization data: Expected an object");
  }
  const { id, name, code, phoneNo, address, panNo, establishDate, active, logo, created_at, updated_at, businessType } =
    data as Record<string, unknown>;

  if (typeof id !== "number") {
    throw new Error("Invalid organization data: ID must be a number");
  }

  if (typeof name !== "string" || !name.trim()) {
    throw new Error("Invalid organization data: Name must be a non-empty string");
  }

  if (!businessType || typeof businessType !== "object" || typeof (businessType as any).id !== "number") {
    throw new Error("Invalid business type");
  }

  return {
    id,
    name,
    code: code as string,
    phoneNo: phoneNo as string,
    address: address as string,
    panNo: panNo as string | undefined,
    establishDate: establishDate as string | undefined,
    active: active as boolean | undefined,
    logo: logo as string | undefined,
    createdAt: created_at as Date,
    updatedAt: updated_at as Date,
    businessType: businessType as any,
  };
};

export const getAllOrganizations = async (): Promise<OrganizationWithId[]> => {
  try {
    const json = await apiClient.get(ENDPOINTS.CUSTOMERS.LIST);
    const response = ApiResponseList.fromJson<OrganizationWithId>(
      json as Record<string, unknown>,
      transformOrganization,
    );
    return response.getResult();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to fetch organizations: ${message}`);
  }
};

export const getOrganizationById = async (id: number): Promise<OrganizationWithId> => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid ID: Must be a positive integer");
  }

  try {
    const json = await apiClient.get(ENDPOINTS.CUSTOMERS.LIST);
    const response = ApiResponseSingle.fromJson<OrganizationWithId>(
      json as Record<string, unknown>,
      transformOrganization,
    );
    return response.getResult();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to fetch organization with ID ${id}: ${message}`);
  }
};

export const createOrganization = async (organization: OrganizationBase): Promise<OrganizationWithId> => {
  if (!organization?.name || !organization.businessType?.id) {
    throw new Error("Invalid data: name and businessType.id are required");
  }

  try {
    const json = await apiClient.post(ENDPOINTS.CUSTOMERS.LIST, organization);
    const response = ApiResponseSingle.fromJson<OrganizationWithId>(
      json as Record<string, unknown>,
      transformOrganization,
    );
    return response.getResult();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to create organization: ${message}`);
  }
};

export const updateOrganization = async (organization: OrganizationWithId): Promise<OrganizationWithId> => {
  if (!organization?.id || !organization.name) {
    throw new Error("Invalid data: ID and name are required");
  }

  try {
    const json = await apiClient.put(`${ENDPOINTS.CUSTOMERS.LIST}/${organization.id}`, organization);
    const response = ApiResponseSingle.fromJson<OrganizationWithId>(
      json as Record<string, unknown>,
      transformOrganization,
    );
    return response.getResult();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to update organization with ID ${organization.id}: ${message}`);
  }
};

export const deleteOrganization = async (id: number): Promise<void> => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid ID: Must be a positive integer");
  }

  try {
    await apiClient.delete(`${ENDPOINTS.CUSTOMERS.LIST}/${id}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to delete organization with ID ${id}: ${message}`);
  }
};
