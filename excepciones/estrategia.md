# Estrategia de Manejo de Excepciones para API Express/TypeScript

## Descripción General
Esta documentación describe una estrategia robusta para el manejo de excepciones en APIs desarrolladas con Express y TypeScript, implementando un sistema de trazabilidad y respuestas estandarizadas.

## Características Principales
- Manejo centralizado de excepciones
- Trazabilidad mediante ID único de transacción
- Estructura de respuesta estandarizada
- Middleware para logging y tracking
- Tipado fuerte con TypeScript
- Compatibilidad con Node.js 20

## Instalación

```bash
npm install express typescript @types/express uuid @types/uuid winston express-winston nodemon
```

## Estructura de Respuesta Estandarizada

```typescript
interface ApiResponse<T> {
  traceId: string;
  status: number;
  code: string;
  message: string;
  data?: T;
  details?: unknown;
}
```

## Implementación

### 1. Configuración Base

```typescript
// src/types/api-response.ts
export interface ApiResponse<T> {
  traceId: string;
  status: number;
  code: string;
  message: string;
  data?: T;
  details?: unknown;
}

// src/exceptions/base-exception.ts
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

// src/exceptions/not-found.exception.ts
export class NotFoundException extends BaseException {
  constructor(message: string = 'Recurso no encontrado', details?: unknown) {
    super(404, 'NOT_FOUND', message, details);
  }
}

// src/exceptions/bad-request.exception.ts
export class BadRequestException extends BaseException {
  constructor(message: string = 'Solicitud inválida', details?: unknown) {
    super(400, 'BAD_REQUEST', message, details);
  }
}
```

### 2. Middleware de Trazabilidad

```typescript
// src/middleware/trace.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

declare global {
  namespace Express {
    interface Request {
      traceId: string;
    }
  }
}

export const traceMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  req.traceId = req.headers['x-trace-id'] as string || uuidv4();
  res.setHeader('x-trace-id', req.traceId);
  next();
};
```

### 3. Middleware de Logging

```typescript
// src/middleware/logger.middleware.ts
import winston from 'winston';
import expressWinston from 'express-winston';

export const loggerMiddleware = expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  ),
  meta: true,
  msg: "HTTP {{req.method}} {{req.url}}",
  expressFormat: true,
  colorize: false,
  ignoreRoute: function (req, res) { return false; }
});
```

### 4. Manejador Global de Excepciones

```typescript
// src/middleware/error-handler.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { BaseException } from '../exceptions/base-exception';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const response = {
    traceId: req.traceId,
    status: error instanceof BaseException ? error.status : 500,
    code: error instanceof BaseException ? error.code : 'INTERNAL_SERVER_ERROR',
    message: error.message || 'Error interno del servidor',
    details: error instanceof BaseException ? error.details : undefined
  };

  res.status(response.status).json(response);
};
```

### Petición Exitosa

```bash
curl http://localhost:3000/api/users/1
```

Respuesta:

```json
{
  "traceId": "550e8400-e29b-41d4-a716-446655440000",
  "status": 200,
  "code": "SUCCESS",
  "message": "Usuario encontrado exitosamente",
  "data": {
    "id": "1",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Petición con Error

```bash
curl http://localhost:3000/api/users/999
```

Respuesta:

```json
{
  "traceId": "550e8400-e29b-41d4-a716-446655440000",
  "status": 404,
  "code": "NOT_FOUND",
  "message": "Usuario con ID 999 no encontrado"
}
```

## Buenas Prácticas

1. **Trazabilidad**:
   - Utilizar el traceId en todos los logs
   - Mantener el mismo traceId a través de toda la transacción
   - Propagar el traceId en llamadas a servicios externos

2. **Logging**:
   - Registrar información relevante sin datos sensibles
   - Incluir contexto suficiente para debugging
   - Utilizar niveles de log apropiados (info, error, debug)

3. **Manejo de Errores**:
   - Crear excepciones específicas para diferentes casos
   - Mantener consistencia en los códigos de error
   - Documentar todos los posibles códigos de error

## Consideraciones de Seguridad

1. No exponer detalles técnicos en producción
2. Sanitizar datos sensibles en los logs
3. Validar y sanitizar todas las entradas de usuario
4. Implementar rate limiting y otras medidas de protección

## Mejoras Sugeridas

1. Implementar cache de respuestas frecuentes
2. Agregar compresión de respuestas
3. Implementar circuit breakers para servicios externos
4. Agregar métricas de performance
5. Implementar validación de esquemas con Joi o Zod