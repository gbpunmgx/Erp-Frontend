export abstract class ApiResponseBase<T, U = unknown> {
  status: number;
  message: string;

  constructor(status: number, message: string) {
    this.status = status;
    this.message = message;
  }

  abstract getResult(): T | T[];

  abstract toJson(transform: (value: T) => U): {
    status: number;
    message: string;
    data: U | U[];
    [key: string]: unknown;
  };
}
