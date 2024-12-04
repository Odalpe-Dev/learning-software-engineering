export class BaseException extends Error {
  constructor(
    public status: number,
    public code: string,
    public message: string,
    public details?: unknown
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}