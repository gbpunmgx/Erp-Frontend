import { ApiError } from "@/lib/api/api-error";

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

class ApiClient {
  private static instance: ApiClient | null = null;
  private readonly baseURL: string;
  private readonly headers: Record<string, string>;

  private constructor(baseURL: string) {
    if (!baseURL) throw new Error("baseURL cannot be empty or undefined");
    this.baseURL = baseURL.endsWith("/") ? baseURL : `${baseURL}/`;
    this.headers = { "Content-Type": "application/json" };
  }

  static getInstance(baseURL?: string): ApiClient {
    const finalUrl = baseURL ?? BASE_URL;
    ApiClient.instance ??= new ApiClient(finalUrl);
    return ApiClient.instance;
  }

  static resetInstance(baseURL: string): void {
    ApiClient.instance = new ApiClient(baseURL);
  }

  private buildUrl(endpoint: string, queryParams: Record<string, string | number | boolean> = {}): string {
    const url = new URL(`${this.baseURL}${endpoint.startsWith("/") ? endpoint.slice(1) : endpoint}`);
    Object.entries(queryParams).forEach(([key, value]) => url.searchParams.append(key, value.toString()));
    return url.toString();
  }

  private async parseResponseBody<T>(response: Response, url: string): Promise<T> {
    const contentType = response.headers.get("Content-Type");
    if (contentType?.includes("application/json")) {
      try {
        return await response.json();
      } catch (error) {
        console.error(`[ApiClient] Failed to parse JSON for ${url}:`, error);
        throw new ApiError(0, "Failed to parse JSON response.", { error, url });
      }
    }
    return (await response.text()) as T;
  }

  private handleHttpError(statusCode: number, responseBody: unknown): never {
    const defaultMessages = new Map<number, string>([
      [400, "Bad Request: Invalid data provided."],
      [401, "Unauthorized: Please log in."],
      [403, "Forbidden: Access denied."],
      [404, "Not Found: Resource not found."],
      [429, "Too Many Requests: Rate limit exceeded."],
      [500, "Internal Server Error: Something went wrong on the server."],
      [503, "Service Unavailable: Server is temporarily down."],
    ]);

    const messageFromBody = this.getMessageFromResponseBody(responseBody);
    const errorMessage = messageFromBody ?? defaultMessages.get(statusCode) ?? `Unexpected Error: ${statusCode}`;
    throw new ApiError(statusCode, errorMessage, responseBody);
  }

  private getMessageFromResponseBody(body: unknown): string | undefined {
    if (typeof body === "object" && body !== null && "message" in body && typeof (body as any).message === "string") {
      return (body as any).message;
    }
    return undefined;
  }

  private async executeFetch(url: string, options: RequestInit, timeoutMs: number): Promise<Response> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        credentials: "include",
      });
      clearTimeout(timeout);
      return response;
    } catch (error) {
      clearTimeout(timeout);
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new ApiError(0, "Request timed out.", { error, url });
      }
      if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
        throw new ApiError(0, "Network error or CORS issue.", { error, url, baseURL: this.baseURL });
      }
      throw error instanceof ApiError ? error : new ApiError(0, "Unexpected API error occurred.", { error, url });
    }
  }

  private async handleResponse<T>(url: string, options: RequestInit, timeoutMs: number, retrying = false): Promise<T> {
    const response = await this.executeFetch(url, options, timeoutMs);
    const responseBody = await this.parseResponseBody<T>(response, url);

    if (!response.ok) {
      if (response.status === 401 && !retrying) {
        try {
          const refreshRes = await this.post<{ data: { accessToken: string } }>("auth/refresh", null);
          if (refreshRes?.data?.accessToken) {
            setAccessToken(refreshRes.data.accessToken);
            options.headers = {
              ...(options.headers as Record<string, string>),
              Authorization: `Bearer ${refreshRes.data.accessToken}`,
            };
            const retryRes = await this.executeFetch(url, options, timeoutMs);
            return this.parseResponseBody<T>(retryRes, url);
          }
        } catch (err) {
          console.error("Refresh token failed", err);
          setAccessToken(null);
          throw new ApiError(401, "Unauthorized, please login again.", { err });
        }
      }
      this.handleHttpError(response.status, responseBody);
    }
    return responseBody;
  }

  async request<T = unknown>(
    endpoint: string,
    method: string = "GET",
    body: unknown = null,
    queryParams: Record<string, string | number | boolean> = {},
    customHeaders: Record<string, string> = {},
    timeoutMs: number = 30000,
  ): Promise<T> {
    const headers: Record<string, string> = { ...this.headers, ...customHeaders };
    if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

    const options: RequestInit = { method, headers };
    if (body) options.body = headers["Content-Type"] === "application/json" ? JSON.stringify(body) : (body as BodyInit);

    const url = this.buildUrl(endpoint, queryParams);
    return this.handleResponse<T>(url, options, timeoutMs);
  }

  async get<T = unknown>(endpoint: string, queryParams = {}, customHeaders = {}, timeoutMs = 30000): Promise<T> {
    return this.request<T>(endpoint, "GET", null, queryParams, customHeaders, timeoutMs);
  }

  async post<T = unknown>(
    endpoint: string,
    body: unknown,
    customHeaders = {},
    queryParams = {},
    timeoutMs = 30000,
  ): Promise<T> {
    return this.request<T>(endpoint, "POST", body, queryParams, customHeaders, timeoutMs);
  }

  async put<T = unknown>(
    endpoint: string,
    body: unknown,
    customHeaders = {},
    queryParams = {},
    timeoutMs = 30000,
  ): Promise<T> {
    return this.request<T>(endpoint, "PUT", body, queryParams, customHeaders, timeoutMs);
  }

  async delete<T = unknown>(endpoint: string, queryParams = {}, customHeaders = {}, timeoutMs = 30000): Promise<T> {
    return this.request<T>(endpoint, "DELETE", null, queryParams, customHeaders, timeoutMs);
  }
}

export default ApiClient;
