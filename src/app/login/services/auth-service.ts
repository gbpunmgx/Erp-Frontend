import ApiClient from "@/lib/api/api-client";
import { ENDPOINTS } from "@/utils/endpoints";

export interface LoginResponse {
  username: string;
  email: string;
  accessToken: string | null;
  refreshToken: string | null;
  roleAndAcl: Record<string, string[]>;
  organizationId: number;
  branchId: number;
  branchName: string;
}

class AuthService {
  private api = ApiClient.getInstance();

  async login(username: string, password: string): Promise<LoginResponse> {
    const res = await this.api.post<{ data: LoginResponse; message: string }>(ENDPOINTS.AUTH.LOGIN, {
      username,
      password,
    });
    return res.data;
  }
}

export default new AuthService();
