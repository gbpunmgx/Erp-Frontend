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

  async logout(): Promise<string> {
    const res = await this.api.post<{ message: string }>(ENDPOINTS.AUTH.LOGOUT, {});
    return res.message;
  }
}

const authService = new AuthService();
export default authService;
