// src/types/api-response.ts
export interface ApiResponse<T> {
  traceId: string;
  status: number;
  code: string;
  message: string;
  data?: T;
  details?: unknown;
}

export class ApiResponseBuilder<T> {
  private response: ApiResponse<T>;

  constructor(traceId: string) {
    this.response = {
      traceId,
      status: 200,
      code: 'SUCCESS',
      message: ''
    };
  }

  setStatus(status: number): this {
    this.response.status = status;
    return this;
  }

  setCode(code: string): this {
    this.response.code = code;
    return this;
  }

  setMessage(message: string): this {
    this.response.message = message;
    return this;
  }

  setData(data: T): this {
    this.response.data = data;
    return this;
  }

  setDetails(details: unknown): this {
    this.response.details = details;
    return this;
  }

  build(): ApiResponse<T> {
    return this.response;
  }
}