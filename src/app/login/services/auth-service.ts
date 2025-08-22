import ApiClient, { setAccessToken, getAccessToken } from "@/lib/api/api-client";
import { ENDPOINTS } from "@/utils/endpoints";

export interface LoginResponse {
  accessToken: string;
  authorities: string[];
}

class AuthService {
  private api = ApiClient.getInstance();

  async login(username: string, password: string): Promise<LoginResponse> {
    const res = await this.api.post<{ data: LoginResponse; message: string }>(
      ENDPOINTS.AUTH.LOGIN,
      { username, password }
    );

    setAccessToken(res.data.accessToken);
    return res.data;
  }

  async refreshToken(): Promise<LoginResponse> {
    const res = await this.api.post<{ data: LoginResponse; message: string }>(
      ENDPOINTS.AUTH.REFRESH,
      null
    );

    if (res?.data?.accessToken) {
      setAccessToken(res.data.accessToken);
    }

    return res.data;
  }

  logout() {
    setAccessToken(null);
  }

  getAccessToken(): string | null {
    return getAccessToken();
  }
}

export default new AuthService();
