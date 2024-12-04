import { BaseException } from "./base-exception";

export class BadRequestException extends BaseException {
  constructor(message: string = 'Solicitud inválida', details?: unknown) {
    super(400, 'BAD_REQUEST', message, details);
  }
}