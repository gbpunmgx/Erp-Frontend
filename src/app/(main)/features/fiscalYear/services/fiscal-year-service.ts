import ApiClient from "@/lib/api/api-client";
import { ApiError } from "@/lib/api/api-error";
import { ENDPOINTS } from "@/utils/endpoints";
import { FiscalYear } from "../types/fiscal-year";

class FiscalYearService {
  private api = ApiClient.getInstance();

  async getAll(): Promise<FiscalYear[]> {
    try {
      const res = await this.api.get<{ data: FiscalYear[]; message: string }>(ENDPOINTS.FISCAL_YEAR.GET_ALL);
      return res.data;
    } catch (error) {
      throw this.handleError(error, "Failed to fetch employees.");
    }
  }

  async getById(id: number): Promise<FiscalYear> {
    try {
      const res = await this.api.get<{ data: FiscalYear; message: string }>(`${ENDPOINTS.FISCAL_YEAR.GET_BY_ID}${id}`);
      return res.data;
    } catch (error) {
      throw this.handleError(error, `Failed to fetch employee with ID ${id}.`);
    }
  }

  async create(employee: FiscalYear): Promise<FiscalYear> {
    try {
      const res = await this.api.post<{ data: FiscalYear; message: string }>(ENDPOINTS.FISCAL_YEAR.CREATE, employee);
      return res.data;
    } catch (error) {
      throw this.handleError(error, "Failed to create employee.");
    }
  }

  async update(id: number, employee: FiscalYear): Promise<FiscalYear> {
    try {
      const res = await this.api.put<{ data: FiscalYear; message: string }>(
        `${ENDPOINTS.FISCAL_YEAR.UPDATE}${id}`,
        employee,
      );
      return res.data;
    } catch (error) {
      throw this.handleError(error, `Failed to update employee with ID ${id}.`);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.api.delete(`${ENDPOINTS.FISCAL_YEAR.DELETE}${id}`);
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

const fiscalYearService = new FiscalYearService();

export default fiscalYearService;
