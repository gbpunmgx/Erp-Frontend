import { ApiResponseBase } from "./api-response-base";

export class ApiResponseList<T, U = unknown> extends ApiResponseBase<T, U> {
  data: T[];

  constructor(status: number, message: string, data: T[]) {
    super(status, message);
    this.data = data;
  }

  static fromJson<T, U = unknown>(
    json: Record<string, unknown>,
    transform: (item: unknown) => T,
  ): ApiResponseList<T, U> {
    const rawList = Array.isArray(json.data) ? json.data : [];
    return new ApiResponseList<T, U>(Number(json.status), String(json.message), rawList.map(transform));
  }

  override getResult(): T[] {
    return this.data;
  }

  override toJson(transform: (item: T) => U): {
    status: number;
    message: string;
    data: U[];
  } {
    return {
      status: this.status,
      message: this.message,
      data: this.data.map(transform),
    };
  }
}
