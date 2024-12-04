import { BaseException } from "./base-exception";

export class NotFoundException extends BaseException {
  constructor(message: string = 'Recurso no encontrado', details?: unknown) {
    super(404, 'NOT_FOUND', message, details);
  }
}