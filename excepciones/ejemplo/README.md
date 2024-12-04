# Sistema de Gestión de Excepciones para API Express/TypeScript

Este proyecto implementa una estrategia robusta para el manejo de excepciones en APIs desarrolladas con Express y TypeScript. El sistema proporciona una gestión centralizada de errores, trazabilidad mediante identificadores únicos, y una estructura de respuesta estandarizada para todas las operaciones de la API.

## Características Principales

Este sistema incluye un conjunto completo de funcionalidades para el desarrollo profesional de APIs:

- Manejo centralizado de excepciones con trazabilidad completa
- Estructura de respuesta estandarizada para todas las operaciones
- Sistema de logging integrado con Winston
- Configuración completa de TypeScript con soporte para Node.js 20
- Sistema de pruebas unitarias con Jest
- Verificación de código con ESLint
- Desarrollo continuo con hot-reloading mediante Nodemon

## Requisitos Técnicos

Para implementar este sistema, se requiere:

- Node.js 20.x o superior
- npm 9.x o superior
- TypeScript 5.x

## Proceso de Instalación

Para comenzar con el proyecto, siga estos pasos:

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd <nombre-del-proyecto>

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
```

## Estructura del Proyecto

El proyecto está organizado de la siguiente manera para mantener una separación clara de responsabilidades:

```
├── src/
│   ├── exceptions/        # Definiciones de excepciones
│   │   ├── base-exception.ts
│   │   ├── not-found.exception.ts
│   │   └── bad-request.exception.ts
│   ├── middleware/        # Middlewares de la aplicación
│   │   ├── error-handler.middleware.ts
│   │   ├── logger.middleware.ts
│   │   └── trace.middleware.ts
│   ├── types/            # Definiciones de tipos
│   │   ├── api-response.ts
│   │   └── environment.d.ts
│   ├── routes/           # Rutas de la API
│   │   └── users.routes.ts
│   ├── app.ts            # Configuración de la aplicación
│   └── server.ts         # Punto de entrada
├── tests/                # Pruebas unitarias
├── .eslintrc            # Configuración de ESLint
├── .gitignore           # Exclusiones de Git
├── jest.config.js       # Configuración de Jest
├── nodemon.json         # Configuración de Nodemon
├── package.json         # Dependencias y scripts
├── tsconfig.json        # Configuración de TypeScript
└── README.md            # Documentación
```

## Configuración

### Gestión de Dependencias (package.json)

```json
{
  "name": "express-error-handling",
  "version": "1.0.0",
  "description": "API con manejo de excepciones y trazabilidad",
  "main": "dist/server.js",
  "scripts": {
    "start": "node dist/server.js",
    "dev": "nodemon",
    "build": "tsc",
    "lint": "eslint . --ext .ts",
    "lint:fix": "eslint . --ext .ts --fix",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "uuid": "^9.0.1",
    "winston": "^3.11.0",
    "express-winston": "^4.2.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.0",
    "@types/uuid": "^9.0.7",
    "@typescript-eslint/eslint-plugin": "^6.12.0",
    "@typescript-eslint/parser": "^6.12.0",
    "eslint": "^8.54.0",
    "nodemon": "^3.0.1",
    "ts-node": "^10.9.1",
    "typescript": "^5.3.2",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.10",
    "ts-jest": "^29.1.1"
  }
}
```

### Configuración de TypeScript (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "moduleResolution": "node",
    "baseUrl": "src",
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "paths": {
      "@/*": ["*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Configuración de Nodemon (nodemon.json)

```json
{
  "watch": ["src"],
  "ext": ".ts,.js",
  "ignore": [],
  "exec": "ts-node ./src/server.ts"
}
```

## API y Endpoints

El sistema proporciona una API RESTful para la gestión de usuarios con los siguientes endpoints:

- `GET /api/users`: Recupera la lista completa de usuarios
- `GET /api/users/:id`: Obtiene un usuario específico por ID
- `POST /api/users`: Crea un nuevo usuario
- `PUT /api/users/:id`: Actualiza un usuario existente
- `DELETE /api/users/:id`: Elimina un usuario existente

## Ejemplos de Uso

### Obtener Lista de Usuarios

```bash
curl -X GET http://localhost:3000/api/users \
-H "Content-Type: application/json"
```

Respuesta:
```json
{
  "traceId": "550e8400-e29b-41d4-a716-446655440000",
  "status": 200,
  "code": "USERS_FOUND",
  "message": "Usuarios recuperados exitosamente",
  "data": [
    {
      "id": "123",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-12-04T10:00:00.000Z"
    }
  ]
}
```

### Crear Usuario

```bash
curl -X POST http://localhost:3000/api/users \
-H "Content-Type: application/json" \
-d '{
  "name": "John Doe",
  "email": "john@example.com"
}'
```

Respuesta:
```json
{
  "traceId": "550e8400-e29b-41d4-a716-446655440000",
  "status": 201,
  "code": "USER_CREATED",
  "message": "Usuario creado exitosamente",
  "data": {
    "id": "123",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-12-04T10:00:00.000Z"
  }
}
```

## Códigos de Respuesta

El sistema utiliza los siguientes códigos de respuesta estandarizados:

- `USER_FOUND`: Usuario encontrado exitosamente
- `USERS_FOUND`: Usuarios recuperados exitosamente
- `USER_CREATED`: Usuario creado exitosamente
- `USER_UPDATED`: Usuario actualizado exitosamente
- `USER_DELETED`: Usuario eliminado exitosamente
- `BAD_REQUEST`: Error en la solicitud
- `NOT_FOUND`: Recurso no encontrado

## Validaciones

El sistema implementa las siguientes validaciones automáticas:

- Verificación de campos requeridos (nombre y email) en la creación
- Validación de formato de email
- Prevención de duplicación de emails
- Verificación de existencia de usuarios para operaciones de actualización y eliminación

## Consideraciones de Seguridad

Para mantener la seguridad de la aplicación, se implementan las siguientes medidas:

- Sanitización de datos en registros de log
- Ocultamiento de detalles técnicos en ambiente de producción
- Validación y sanitización de todas las entradas de usuario
- Implementación de límites de tasa de solicitudes

## Buenas Prácticas

Para mantener la calidad del código y la operación del sistema:

- Mantener consistencia en los códigos de error
- Documentar todos los códigos de error posibles
- Utilizar niveles apropiados de logging
- Propagar el identificador de trazabilidad en llamadas entre servicios
