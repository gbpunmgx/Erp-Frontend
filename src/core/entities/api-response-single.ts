import { ApiResponseBase } from "./api-response-base";

export class ApiResponseSingle<T, U = unknown> extends ApiResponseBase<T, U> {
  type: string;
  data: T;

  constructor(type: string, status: number, message: string, data: T) {
    super(status, message);
    this.type = type;
    this.data = data;
  }

  static fromJson<T, U = unknown>(
    json: Record<string, unknown>,
    transform: (value: unknown) => T,
  ): ApiResponseSingle<T, U> {
    return new ApiResponseSingle<T, U>(
      String(json.type),
      Number(json.status),
      String(json.message),
      transform(json.data),
    );
  }

  override getResult(): T {
    return this.data;
  }

  override toJson(transform: (value: T) => U): {
    status: number;
    message: string;
    data: U;
    type: string;
  } {
    return {
      type: this.type,
      status: this.status,
      message: this.message,
      data: transform(this.data),
    };
  }
}
