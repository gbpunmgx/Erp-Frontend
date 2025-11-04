import ApiClient from "@/lib/api/api-client";
import { ENDPOINTS } from "@/utils/endpoints";
import { ApiError } from "@/lib/api/api-error";
import { Attendance } from "@/app/(main)/features/attendances/types/attendance";

class AttendanceService {
  private api = ApiClient.getInstance();

  async getAll(): Promise<Attendance[]> {
    try {
      const res = await this.api.get<{ data: Attendance[]; message: string }>(ENDPOINTS.ATTENDANCE.GET_ALL);
      return res.data;
    } catch (error) {
      throw this.handleError(error, "Failed to fetch Attendances.");
    }
  }

  async getById(id: number): Promise<Attendance> {
    try {
      const res = await this.api.get<{ data: Attendance; message: string }>(`${ENDPOINTS.ATTENDANCE.GET_BY_ID}${id}`);
      return res.data;
    } catch (error) {
      throw this.handleError(error, `Failed to fetch Attendance with ID ${id}.`);
    }
  }

  async create(Attendance: Attendance): Promise<Attendance> {
    try {
      const res = await this.api.post<{ data: Attendance; message: string }>(ENDPOINTS.ATTENDANCE.CREATE, Attendance);
      return res.data;
    } catch (error) {
      throw this.handleError(error, "Failed to create Attendance.");
    }
  }

  async update(id: number, Attendance: Attendance): Promise<Attendance> {
    try {
      const res = await this.api.put<{ data: Attendance; message: string }>(
        `${ENDPOINTS.ATTENDANCE.UPDATE}${id}`,
        Attendance,
      );
      return res.data;
    } catch (error) {
      throw this.handleError(error, `Failed to update Attendance with ID ${id}.`);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.api.delete(`${ENDPOINTS.ATTENDANCE.DELETE}${id}`);
    } catch (error) {
      throw this.handleError(error, `Failed to delete Attendance with ID ${id}.`);
    }
  }

  private handleError(error: unknown, fallbackMessage: string): never {
    if (error instanceof ApiError) {
      throw error;
    }
    const errorMessage = error instanceof Error ? error.message : fallbackMessage;
    console.error("[AttendanceService] Unexpected error:", error);
    throw new ApiError(0, errorMessage, { cause: error });
  }
}

export default new AttendanceService();
