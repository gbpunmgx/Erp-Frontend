import ApiClient from "@/lib/api/api-client";
import { ENDPOINTS } from "@/utils/endpoints";
import { Payroll, PayrollDto } from "@/app/(main)/features/payrolls/types/payrolls";

class PayrollService {
  private api = ApiClient.getInstance();

  async getAll(): Promise<Payroll[]> {
    const res = await this.api.get<{ data: Payroll[]; message: string }>(ENDPOINTS.PAYROLL.GET_ALL);
    return res.data;
  }

  async getById(id: number): Promise<Payroll> {
    const res = await this.api.get<{ data: Payroll; message: string }>(`${ENDPOINTS.PAYROLL.GET_BY_ID}/${id}`);
    return res.data;
  }

  async create(payload: PayrollDto): Promise<Payroll> {
    const res = await this.api.post<{ data: Payroll; message: string }>(ENDPOINTS.PAYROLL.CREATE, payload);
    return res.data;
  }

  async update(id: number, payload: PayrollDto): Promise<Payroll> {
    const res = await this.api.put<{ data: Payroll; message: string }>(`${ENDPOINTS.PAYROLL.UPDATE}/${id}`, payload);
    return res.data;
  }

  async delete(id: number): Promise<void> {
    await this.api.delete(`${ENDPOINTS.PAYROLL.DELETE}/${id}`);
  }
}

export default new PayrollService();
