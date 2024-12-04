# Guía de Testing para Node.js con TypeScript

## Configuración Inicial

### Requisitos Previos
- Node.js v20.x
- TypeScript 5.x
- npm o yarn

### Instalación de Dependencias

```bash
npm init -y
npm install --save-dev typescript @types/node ts-node
npm install --save-dev jest @types/jest ts-jest
npm install --save-dev @testing-library/jest-dom
npm install --save-dev supertest @types/supertest
```

### Configuración de TypeScript
Crea un archivo `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.test.ts"]
}
```

### Configuración de Jest
Crea un archivo `jest.config.js`:

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts'
  ]
};
```

## Estructura del Proyecto

```
├── src/
│   ├── services/
│   │   ├── userService.ts
│   │   └── __tests__/
│   │       └── userService.test.ts
│   ├── controllers/
│   │   ├── userController.ts
│   │   └── __tests__/
│   │       └── userController.test.ts
│   ├── models/
│   │   └── user.ts
│   └── utils/
│       ├── validators.ts
│       └── __tests__/
│           └── validators.test.ts
├── jest.config.js
├── tsconfig.json
└── package.json
```

## Pruebas Unitarias

### Ejemplo de Prueba de Validador

```typescript
// src/utils/validators.ts
export class UserValidator {
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidPassword(password: string): boolean {
    return password.length >= 8 &&
           /[A-Z]/.test(password) &&
           /[a-z]/.test(password) &&
           /[0-9]/.test(password);
  }
}

// src/utils/__tests__/validators.test.ts
import { UserValidator } from '../validators';

describe('UserValidator', () => {
  describe('isValidEmail', () => {
    test('should return true for valid email', () => {
      expect(UserValidator.isValidEmail('user@example.com')).toBe(true);
    });

    test('should return false for invalid email', () => {
      expect(UserValidator.isValidEmail('invalid-email')).toBe(false);
      expect(UserValidator.isValidEmail('user@')).toBe(false);
      expect(UserValidator.isValidEmail('@example.com')).toBe(false);
    });
  });

  describe('isValidPassword', () => {
    test('should return true for valid password', () => {
      expect(UserValidator.isValidPassword('Password123')).toBe(true);
    });

    test('should return false for invalid passwords', () => {
      expect(UserValidator.isValidPassword('pass')).toBe(false); // too short
      expect(UserValidator.isValidPassword('password123')).toBe(false); // no uppercase
      expect(UserValidator.isValidPassword('PASSWORD123')).toBe(false); // no lowercase
      expect(UserValidator.isValidPassword('Passwordabc')).toBe(false); // no numbers
    });
  });
});
```

### Ejemplo de Prueba con Base de Datos (SQL)

```typescript
// src/services/userService.ts
import { Pool } from 'pg';

export class UserService {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async createUser(email: string, name: string): Promise<any> {
    const result = await this.pool.query(
      'INSERT INTO users(email, name) VALUES($1, $2) RETURNING *',
      [email, name]
    );
    return result.rows[0];
  }

  async getUserByEmail(email: string): Promise<any> {
    const result = await this.pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  }
}

// src/services/__tests__/userService.test.ts
import { Pool } from 'pg';
import { UserService } from '../userService';

jest.mock('pg', () => {
  const mPool = {
    query: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

describe('UserService', () => {
  let pool: Pool;
  let userService: UserService;

  beforeEach(() => {
    pool = new Pool();
    userService = new UserService(pool);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    test('should create a new user successfully', async () => {
      const mockUser = { id: 1, email: 'test@example.com', name: 'Test User' };
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockUser] });

      const result = await userService.createUser('test@example.com', 'Test User');

      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO users(email, name) VALUES($1, $2) RETURNING *',
        ['test@example.com', 'Test User']
      );
      expect(result).toEqual(mockUser);
    });

    test('should throw an error if user creation fails', async () => {
      (pool.query as jest.Mock).mockRejectedValueOnce(new Error('User creation failed'));

      await expect(userService.createUser(' ', 'Test User')).rejects.toThrow('User creation failed');

  });

```

### Ejemplo de Prueba con AWS DynamoDB

```typescript
// src/services/dynamoService.ts
import { DynamoDB } from 'aws-sdk';

export class DynamoService {
  private docClient: DynamoDB.DocumentClient;
  private tableName: string;

  constructor(tableName: string) {
    this.docClient = new DynamoDB.DocumentClient();
    this.tableName = tableName;
  }

  async saveItem(item: any): Promise<any> {
    const params = {
      TableName: this.tableName,
      Item: item
    };

    await this.docClient.put(params).promise();
    return item;
  }

  async getItem(key: any): Promise<any> {
    const params = {
      TableName: this.tableName,
      Key: key
    };

    const result = await this.docClient.get(params).promise();
    return result.Item;
  }
}

// src/services/__tests__/dynamoService.test.ts
import { DynamoDB } from 'aws-sdk';
import { DynamoService } from '../dynamoService';

jest.mock('aws-sdk', () => {
  const mDocClient = {
    put: jest.fn().mockReturnThis(),
    get: jest.fn().mockReturnThis(),
    promise: jest.fn()
  };
  return {
    DynamoDB: {
      DocumentClient: jest.fn(() => mDocClient)
    }
  };
});

describe('DynamoService', () => {
  let dynamoService: DynamoService;
  let mockDocClient: any;

  beforeEach(() => {
    dynamoService = new DynamoService('TestTable');
    mockDocClient = new DynamoDB.DocumentClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('saveItem', () => {
    test('should save item successfully', async () => {
      const mockItem = { id: '123', name: 'Test Item' };
      mockDocClient.promise.mockResolvedValueOnce({});

      const result = await dynamoService.saveItem(mockItem);

      expect(mockDocClient.put).toHaveBeenCalledWith({
        TableName: 'TestTable',
        Item: mockItem
      });
      expect(result).toEqual(mockItem);
    });
  });
});
```

## Pruebas de Integración

### Ejemplo de Prueba de API con Supertest

```typescript
// src/app.ts
import express from 'express';
import { UserController } from './controllers/userController';

const app = express();
app.use(express.json());

const userController = new UserController();
app.post('/users', userController.createUser);
app.get('/users/:id', userController.getUser);

export default app;

// src/integration/__tests__/user.test.ts
import request from 'supertest';
import app from '../../app';
import { UserService } from '../../services/userService';

jest.mock('../../services/userService');

describe('User API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /users', () => {
    test('should create a new user', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User'
      };

      (UserService.prototype.createUser as jest.Mock).mockResolvedValueOnce(mockUser);

      const response = await request(app)
        .post('/users')
        .send({
          email: 'test@example.com',
          name: 'Test User'
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockUser);
    });

    test('should return 400 for invalid input', async () => {
      const response = await request(app)
        .post('/users')
        .send({
          email: 'invalid-email',
          name: 'Test User'
        });

      expect(response.status).toBe(400);
    });
  });
});
```

## Script de Pruebas

Añade estos scripts a tu `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:integration": "jest --config jest.integration.config.js",
    "test:ci": "jest --ci --coverage"
  }
}
```

## Mejores Prácticas

1. **Organización de Pruebas**
   - Mantén las pruebas cerca del código que prueban
   - Usa nombres descriptivos para los archivos de prueba
   - Agrupa las pruebas relacionadas en describe blocks

2. **Mocking**
   - Mock las dependencias externas (bases de datos, APIs, servicios)
   - Usa jest.mock() para módulos completos
   - Implementa mocks específicos para casos de prueba

3. **Cobertura**
   - Aspira a una cobertura del 80% o superior
   - Prioriza la calidad de las pruebas sobre la cantidad
   - Usa jest --coverage para generar reportes

4. **Mantenimiento**
   - Mantén las pruebas simples y legibles
   - Evita la duplicación de código en las pruebas
   - Actualiza las pruebas cuando el código cambie

## Recursos Adicionales

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)