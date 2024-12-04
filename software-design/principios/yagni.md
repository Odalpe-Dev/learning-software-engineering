# Principio YAGNI (You Aren't Gonna Need It)

## "No lo vas a necesitar"

### ¿Qué es YAGNI?

YAGNI es un principio de Extreme Programming (XP) que establece que los desarrolladores no deberían agregar funcionalidad hasta que sea realmente necesaria. Este principio nos ayuda a:

- Evitar el desperdicio de tiempo y recursos
- Mantener el código simple y mantenible
- Prevenir la sobre-ingeniería
- Enfocarnos en los requisitos actuales

### Ejemplos de Violaciones YAGNI vs. Código YAGNI

#### 1. Arquitectura Excesiva

```typescript
// ❌ Violación de YAGNI: Arquitectura sobre-diseñada
interface IUserRepository {
    create(user: User): Promise<User>;
    update(user: User): Promise<User>;
    delete(id: string): Promise<void>;
    findById(id: string): Promise<User>;
    findByEmail(email: string): Promise<User>;
}

interface IUserService {
    createUser(userData: UserDTO): Promise<User>;
    updateUser(userData: UserDTO): Promise<User>;
    deleteUser(id: string): Promise<void>;
    getUserById(id: string): Promise<User>;
    getUserByEmail(email: string): Promise<User>;
}

class UserRepository implements IUserRepository {
    private readonly db: Database;
    private readonly cacheManager: CacheManager;
    private readonly eventBus: EventBus;
    
    constructor(db: Database, cacheManager: CacheManager, eventBus: EventBus) {
        this.db = db;
        this.cacheManager = cacheManager;
        this.eventBus = eventBus;
    }
    
    // Implementación con cache, eventos y más...
}

// ✅ YAGNI: Implementación simple que cumple los requisitos actuales
class UserService {
    constructor(private db: Database) {}
    
    async createUser(userData: UserData): Promise<User> {
        return this.db.users.create(userData);
    }
    
    async getUserById(id: string): Promise<User | null> {
        return this.db.users.findUnique({ where: { id } });
    }
}
```

#### 2. Configuración Flexible Prematura

```typescript
// ❌ Violación de YAGNI: Sistema de configuración sobre-elaborado
class PaymentProcessor {
    private config: {
        providers: {
            [key: string]: {
                apiUrl: string;
                apiKey: string;
                timeout: number;
                retryAttempts: number;
                webhookUrl?: string;
                customHeaders?: Record<string, string>;
                featureFlags?: Record<string, boolean>;
            }
        };
        defaultProvider: string;
        fallbackProvider?: string;
        logging: {
            level: string;
            format: string;
            destination: string;
        };
    };

    constructor(config: typeof PaymentProcessor.prototype.config) {
        this.config = config;
    }

    async processPayment(payment: Payment): Promise<PaymentResult> {
        const provider = this.getProvider(payment.type);
        // Lógica compleja considerando todas las opciones...
    }
}

// ✅ YAGNI: Configuración simple basada en necesidades actuales
class PaymentProcessor {
    constructor(
        private apiKey: string,
        private apiUrl: string
    ) {}

    async processPayment(payment: Payment): Promise<PaymentResult> {
        return this.sendPaymentRequest(payment);
    }
}
```

#### 3. Abstracción Prematura

```typescript
// ❌ Violación de YAGNI: Abstracción innecesaria para un solo caso de uso
interface DataFormatter<T> {
    format(data: T): string;
}

interface DataValidator<T> {
    validate(data: T): boolean;
}

interface DataProcessor<T> {
    process(data: T): T;
}

class UserDataFormatter implements DataFormatter<User> {
    format(user: User): string {
        return `${user.firstName} ${user.lastName}`;
    }
}

class UserDataValidator implements DataValidator<User> {
    validate(user: User): boolean {
        return Boolean(user.email && user.firstName);
    }
}

// ✅ YAGNI: Código directo que resuelve el problema actual
class UserProfile {
    formatUserName(user: User): string {
        return `${user.firstName} ${user.lastName}`;
    }

    isValidUser(user: User): boolean {
        return Boolean(user.email && user.firstName);
    }
}
```

#### 4. Funcionalidad Anticipada

```typescript
// ❌ Violación de YAGNI: Implementando características "por si acaso"
class Article {
    title: string;
    content: string;
    author: string;
    tags: string[];
    version: number = 1;
    revisions: Revision[] = [];
    comments: Comment[] = [];
    likes: number = 0;
    shares: number = 0;
    readTime: number;
    isPublished: boolean = false;
    publishedAt?: Date;
    lastModified: Date = new Date();
    
    constructor(data: ArticleData) {
        Object.assign(this, data);
        this.calculateReadTime();
    }
    
    publish() { /* ... */ }
    unpublish() { /* ... */ }
    createRevision() { /* ... */ }
    addComment(comment: Comment) { /* ... */ }
    like() { /* ... */ }
    share() { /* ... */ }
    private calculateReadTime() { /* ... */ }
}

// ✅ YAGNI: Implementando solo lo que se necesita ahora
class Article {
    constructor(
        public title: string,
        public content: string,
        public author: string
    ) {}
    
    publish() {
        return {
            title: this.title,
            content: this.content,
            author: this.author,
            publishedAt: new Date()
        };
    }
}
```

### Cómo Aplicar YAGNI Correctamente

1. **Enfócate en los Requisitos Actuales**

   ```typescript
   // Comienza simple
   class AuthService {
       async login(email: string, password: string): Promise<User> {
           // Implementación básica de login
       }
   }
   
   // Agrega características cuando sean necesarias
   class AuthService {
       async login(email: string, password: string): Promise<User> {
           await this.rateLimit.check(email);
           const user = await this.authenticate(email, password);
           await this.audit.logLogin(user.id);
           return user;
       }
   }
   ```

2. **Refactoriza Cuando sea Necesario**

   ```typescript
   // Empieza con código simple
   function calculateTotal(items: OrderItem[]): number {
       return items.reduce((sum, item) => sum + item.price, 0);
   }
   
   // Refactoriza cuando surjan nuevos requisitos
   function calculateTotal(items: OrderItem[], discountCode?: string): number {
       const subtotal = items.reduce((sum, item) => sum + item.price, 0);
       return this.applyDiscount(subtotal, discountCode);
   }
   ```

### Beneficios de Aplicar YAGNI

1. **Código más Mantenible**
   - Menos código = menos mantenimiento
   - Menor complejidad
   - Más fácil de entender

2. **Desarrollo más Rápido**
   - Menos tiempo en features innecesarias
   - Iteraciones más rápidas
   - Feedback más temprano

3. **Menos Bugs**
   - Menos código = menos bugs
   - Menos casos edge
   - Testing más simple

### Cuándo NO Aplicar YAGNI

1. **Consideraciones de Seguridad**

   ```typescript
   // Excepción justificada a YAGNI: Implementación segura desde el inicio
   class UserAuth {
       async login(credentials: Credentials): Promise<Session> {
           await this.preventBruteForce(credentials.username);
           await this.validateCredentials(credentials);
           return this.createSecureSession();
       }
   }
   ```

2. **Requisitos de Escalabilidad Conocidos**

   ```typescript
   // Excepción justificada: Diseño para escala conocida
   class DataService {
       constructor(private readonly cache: Cache) {}
       
       async getData(id: string): Promise<Data> {
           const cached = await this.cache.get(id);
           if (cached) return cached;
           
           const data = await this.fetchData(id);
           await this.cache.set(id, data);
           return data;
       }
   }
   ```

### Consejos para Mantener YAGNI

1. **Cuestiona Cada Feature**
   - ¿Se necesita ahora?
   - ¿Hay evidencia de que se necesitará?
   - ¿Cuál es el costo de agregarlo después?

2. **Documenta Decisiones**
   - Registra por qué NO implementaste algo
   - Mantén un backlog de features futuros
   - Revisa regularmente las decisiones
