import ApiClient from "@/lib/api/api-client";
import { ENDPOINTS } from "@/utils/endpoints";

export interface LoginResponse {
  authorities: string[];
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

  async refreshToken(): Promise<LoginResponse> {
    const res = await this.api.post<{ data: LoginResponse; message: string }>(ENDPOINTS.AUTH.REFRESH, null);
    return res.data;
  }

  async logout(): Promise<void> {
    await this.api.post(ENDPOINTS.AUTH.LOGOUT, null);
  }
}

export default new AuthService();
