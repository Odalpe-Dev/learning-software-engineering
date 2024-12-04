# Clean Code en TypeScript

Este README ofrece una guía sobre los principios de Código Limpio, ilustrados con ejemplos prácticos en TypeScript. Aborda los aspectos clave del código limpio y proporciona ejemplos concretos que los desarrolladores pueden seguir para mejorar la calidad y mantenibilidad de su código.

## Introducción

Los principios de Clean Code ayudan a crear código mantenible, legible y eficiente. Esta guía demuestra estos principios utilizando TypeScript.

## Objetivos de Clean Code

### Mantenibilidad 🔧

- Código fácil de modificar y adaptar
- Reducción de la deuda técnica
- Menor costo de mantenimiento a largo plazo

### Legibilidad 📖

- Código auto-explicativo
- Fácil de entender por otros desarrolladores
- Reduce el tiempo de incorporación de nuevos miembros al equipo

### Simplicidad ✨

- Soluciones directas y claras
- Evita la complejidad innecesaria
- Sigue el principio KISS (Keep It Simple, Stupid)

### Testeabilidad ✅

- Facilita la escritura de pruebas
- Mejora la confiabilidad del código
- Permite refactorizaciones seguras

## Principios

### 1. Nombres Significativos

Los nombres significativos hacen que el código sea más fácil de entender y mantener. Utiliza nombres descriptivos para variables, funciones y clases.

- Prioriza Nombres que Revelen la Intención: Los nombres deben transmitir claramente el propósito y la funcionalidad de las variables, funciones y clases.
- Minimiza la Desinformación: Evita nombres que confundan o oculten la verdadera naturaleza del elemento que representan.
- Fomenta Distinciones Significativas: Asegúrate de que los nombres proporcionen distinciones claras entre elementos similares, evitando confusión y ambigüedad.
- Adopta Nombres Pronunciables: Opta por nombres que sean fácilmente pronunciables y, por lo tanto, más comunicativos y memorables.
- Mejora la Buscabilidad: Elige nombres que faciliten la búsqueda, haciendo más fácil para los desarrolladores localizar y entender los elementos del código.
- Nombres de Clases y Objetos: Los nombres de clases y objetos deben consistir en sustantivos o frases sustantivas, reflejando su identidad y propósito dentro del sistema.
- Nombre de clases: No deben ser muy largos, pero deben ser descriptivos. Evita nombres genéricos como `Manager` o `Data`.
- Nombres de Métodos: Los nombres de métodos deben estar compuestos por verbos o frases verbales, destacando las acciones u operaciones que realizan dentro del código.

### Ejmplos de nombramiento de variables

```typescript
// ❌ Ejemplo de nombres de variables poco claros
let a = 10;
let b = 20;
let c = a + b;

// ✅ Ejemplo de nombres de variables claros y descriptivos
let firstNumber = 10;
let secondNumber = 20;
let sum = firstNumber + secondNumber;
```

```typescript
// ❌ Ejemplo de nombres de variables confusos
let d = new Date();
let e = d.getDay();
let f = d.getMonth();

// ✅ Ejemplo de nombres de variables claros y descriptivos
let currentDate = new Date();
let currentDay = currentDate.getDay();
let currentMonth = currentDate.getMonth();
```

```typescript
// ❌ Ejemplo de nombres de variables genéricos
let data = fetchData();
let result = processData(data);

// ✅ Ejemplo de nombres de variables específicos
let userData = fetchUserData();
let processedUserData = processUserData(userData);
```

```typescript
// ❌ Ejemplo de nombres de variables con abreviaturas
let usr = getUser();
let addr = usr.getAddress();

// ✅ Ejemplo de nombres de variables sin abreviaturas
let user = getUser();
let address = user.getAddress();
```

```typescript
// ❌ Código difícil de mantener
function p(d: any[]): number {
    let r = 0;
    for(let i = 0; i < d.length; i++) {
        r += d[i].a * d[i].b;
    }
    return r;
}

// ✅ Código limpio y mantenible
interface Product {
    price: number;
    quantity: number;
}

function calculateTotalPrice(products: Product[]): number {
    return products.reduce(
        (total, product) => total + product.price * product.quantity,
        0
    );
}
```

Los argumentos por defecto pueden simplificar las funciones al eliminar la necesidad de comprobaciones condicionales.

```typescript
// Bad
function createUser(name: string, isAdmin?: boolean) {
  if (isAdmin === undefined) {
    isAdmin = false;
  }
  // create user logic
}

// Good
function createUser(name: string, isAdmin: boolean = false) {
  // create user logic
}
```

Evita agregar contexto innecesario a los nombres de las variables, especialmente cuando el contexto ya es claro.

```typescript
// Bad
class Car {
  carMake: string;
  carModel: string;
  carYear: number;

  constructor(make: string, model: string, year: number) {
    this.carMake = make;
    this.carModel = model;
    this.carYear = year;
  }
}
```

```typescript
// Good
class Car {
  make: string;
  model: string;
  year: number;

  constructor(make: string, model: string, year: number) {
    this.make = make;
    this.model = model;
    this.year = year;
  }
}
```

### 2. Funciones

Las funciones deben ser pequeñas y hacer una sola cosa. Deben tener nombres descriptivos y evitar efectos secundarios.

- Mantén las funciones concisas: Limita las funciones a no más de 20 líneas, asegurando claridad y facilidad de comprensión. Las funciones más largas deben considerar dividirse en unidades más pequeñas y enfocadas.
- Mantén la legibilidad con la indentación: Usa la indentación de manera juiciosa para mantener la legibilidad del código. Si se necesitan múltiples indentaciones, considera refactorizarlas en funciones separadas para mejorar la claridad.
- Adopta la responsabilidad única: Cada función debe tener un propósito único y bien definido, fomentando bases de código modulares y mantenibles.
- Prioriza nombres descriptivos: Utiliza nombres descriptivos para las funciones, mejorando la comprensión y proporcionando contexto sobre su funcionalidad.
- Simplifica los argumentos de las funciones: Prefiere argumentos monádicos o diádicos en las funciones, minimizando la complejidad y promoviendo la claridad. Las funciones triádicas deben evitarse en la medida de lo posible para prevenir la sobrecarga cognitiva.
- Implementa la separación de comandos y consultas: Las funciones deben adherirse al principio de separación de comandos y consultas, es decir, deben realizar una acción o devolver un valor, pero no ambos.
- Prefiere excepciones sobre códigos de error: En lugar de devolver códigos de error, prioriza el uso de excepciones para manejar errores, promoviendo un código más limpio y legible.
- Adopta el principio DRY: Evita la duplicación de código abstrayendo la funcionalidad común en funciones o módulos reutilizables, reduciendo la redundancia y promoviendo la mantenibilidad.

```typescript
// ❌ Example of code with bad practices
class OrderProcessor {
    async processOrder(orderId: string, userId: string, items: any[], address: any, paymentInfo: any) {
        let total = 0;
        let isValid = true;
        let errorMsg = '';
        
        // Validate order
        if (!orderId || !userId || !items || items.length === 0) {
            isValid = false;
            errorMsg = 'Invalid order';
            return { success: false, error: errorMsg };
        }

        // Calculate total
        for (let item of items) {
            if (item.price && item.quantity) {
                total += item.price * item.quantity;
                // Apply discount if exists
                if (item.discount) {
                    total -= (item.price * item.quantity * item.discount);
                }
            }
        }

        // Check stock
        for (let item of items) {
            const stock = await this.checkInventory(item.id);
            if (stock < item.quantity) {
                isValid = false;
                 errorMsg = `Insufficient stock for ${item.name}`;
                return { success: false, error: errorMsg };
            }
        }

        // Process payment and update inventory
        if (isValid) {
            try {
                await this.processPayment(paymentInfo, total);
                await this.updateInventory(items);
                await this.saveOrder({ orderId, userId, items, total, address });
                return { success: true, orderId, total };
            } catch (error) {
                 return { success: false, error: 'Error processing order' };
            }
        }
    }

    private async checkInventory(itemId: string): Promise<number> {
        // Inventory check implementation
        return 0;
    }

    private async processPayment(paymentInfo: any, total: number): Promise<void> {
        // Payment processing implementation
    }

    private async updateInventory(items: any[]): Promise<void> {
        // Inventory update implementation
    }

    private async saveOrder(orderData: any): Promise<void> {
        // Order saving implementation
    }
}
```

```typescript
// ✅ Refactored example following good practices
interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    discount?: number;
}

interface Order {
    orderId: string;
    userId: string;
    items: OrderItem[];
    address: Address;
    paymentInfo: PaymentInfo;
}

class OrderValidator {
    validate(order: Order): void {
        this.validateBasicFields(order);
        this.validateItems(order.items);
    }

    private validateBasicFields(order: Order): void {
        if (!order.orderId || !order.userId) {
            throw new Error('Missing required fields in order');
        }
    }

    private validateItems(items: OrderItem[]): void {
        if (!items || items.length === 0) {
           throw new Error('Order must contain at least one item');
        }
    }
}

class PriceCalculator {
    calculateTotal(items: OrderItem[]): number {
        return items.reduce((total, item) => {
            const itemTotal = this.calculateItemTotal(item);
            return total + itemTotal;
        }, 0);
    }

    private calculateItemTotal(item: OrderItem): number {
        const baseTotal = item.price * item.quantity;
        return this.applyDiscount(baseTotal, item.discount);
    }

    private applyDiscount(amount: number, discount?: number): number {
        if (!discount) return amount;
        return amount * (1 - discount);
    }
}

class InventoryManager {
    async verifyStock(items: OrderItem[]): Promise<void> {
        await Promise.all(items.map(item => this.checkItemStock(item)));
    }

    private async checkItemStock(item: OrderItem): Promise<void> {
        const stock = await this.getItemStock(item.id);
        if (stock < item.quantity) {
           throw new Error(`Insufficient stock for ${item.name}`);
        }
    }

    private async getItemStock(itemId: string): Promise<number> {
        // Implementación de verificación de inventario
        return 0;
    }
}

class ModernOrderProcessor {
    constructor(
        private validator: OrderValidator,
        private priceCalculator: PriceCalculator,
        private inventoryManager: InventoryManager,
        private paymentService: PaymentService,
        private orderRepository: OrderRepository
    ) {}

    async processOrder(order: Order): Promise<string> {
        this.validator.validate(order);
        await this.inventoryManager.verifyStock(order.items);
        
        const total = this.priceCalculator.calculateTotal(order.items);
        await this.paymentService.processPayment(order.paymentInfo, total);
        
        return this.orderRepository.saveOrder({
            ...order,
            total
        });
    }
}
```

> Este ejemplo muestra claramente el contraste entre un código mal estructurado y su versión refactorizada siguiendo las buenas prácticas. Veamos las mejoras principales:
>
> Funciones pequeñas y enfocadas:
>
> - Mal ejemplo: `processOrder` hace demasiadas cosas (validar, calcular, verificar stock, procesar pago).
> - Buen ejemplo: Cada clase tiene responsabilidades específicas y métodos concisos.
>
> Nombres descriptivos:
>
> - Mal ejemplo: Nombres genéricos como `processOrder`.
> - Buen ejemplo: Nombres específicos como `validateBasicFields`, `calculateItemTotal`, `verifyStock`.
>
> Responsabilidad única:
>
> - Mal ejemplo: Una sola clase maneja todo el proceso.
> - Buen ejemplo: Separación en clases específicas (`OrderValidator`, `PriceCalculator`, `InventoryManager`).
>
> Manejo de errores:
>
> - Mal ejemplo: Retorna objetos con flags de éxito/error.
> - Buen ejemplo: Usa excepciones para manejar errores de manera más limpia.
>
> Tipado fuerte:
>
> - Mal ejemplo: Usa `any` en varios lugares.
> - Buen ejemplo: Interfaces bien definidas (`OrderItem`, `Order`).
>
> Separación de comandos y consultas:
>
> - Mal ejemplo: Mezcla validación, cálculos y efectos secundarios.
> - Buen ejemplo: Métodos claramente separados para cada propósito.

### 3. Comentarios

Los comentarios deben usarse con moderación y solo para explicar por qué se hace algo, no qué se hace. El código debe ser autoexplicativo.

- Comentarios como Complementos, No Compensaciones: Los comentarios deben mejorar la comprensión del código, no servir como un parche para un código mal escrito. Su función principal es proporcionar contexto o información adicional donde el código por sí solo puede ser insuficiente.
- Deja que el Código Hable por Sí Mismo: Esfuérzate por expresar tus intenciones y lógica claramente a través de un código bien estructurado y autoexplicativo. Los comentarios deben ser complementarios y usarse con moderación.
- Comentarios Informativos: Los comentarios deben proporcionar información valiosa, como explicaciones de la intención, aclaraciones o advertencias sobre posibles consecuencias. Deben enriquecer la comprensión y ayudar en el mantenimiento futuro.
- Cuidado con los Malos Comentarios: Los comentarios engañosos o desactualizados pueden ser más perjudiciales que útiles. Evita usar comentarios para documentar detalles triviales o información del sistema que debería expresarse en el código o la documentación.
- Código sobre Comentarios: Siempre que sea posible, prefiere usar nombres claros y descriptivos para funciones y variables en lugar de comentarios para transmitir la intención. Los comentarios deben complementar el código, no duplicar su propósito.
- Evita el Código Comentado: Los fragmentos de código comentados desordenan la base de código y pueden causar confusión. En lugar de comentar el código, considera eliminarlo y usar el control de versiones para conservar el historial si es necesario.
- Minimiza el Ruido: Evita agregar comentarios innecesarios o redundantes que solo sirvan para desordenar el código. Los comentarios deben agregar valor y claridad sin distraer del propósito del código.
- Mantén el Contexto Local: Asegúrate de que los comentarios proporcionen contexto relevante al código circundante y evita ofrecer información del sistema en comentarios localizados. Esto promueve la claridad y comprensión dentro de secciones específicas del código.

```typescript
// ❌ Ejemplo con malos comentarios
class UserAuthentication {
    // Método para autenticar usuario
    async authenticateUser(username: string, password: string) {
        // Verifica si el username y password no están vacíos
        if (!username || !password) {
            return false;
        }

        // Encripta el password
        const encryptedPassword = this.encryptPassword(password);

        // Busca el usuario en la base de datos
        const user = await this.findUserInDatabase(username);

        // Si no encuentra el usuario, retorna false
        if (!user) {
            return false;
        }

        // Compara las contraseñas
        // TODO: Mejorar la comparación de contraseñas
        // return this.comparePasswords(password, user.password);
        return encryptedPassword === user.password;
    }

    // Método para encriptar el password del usuario utilizando el algoritmo SHA-256
    private encryptPassword(password: string): string {
        // Implementación de la encriptación
        return 'encrypted_' + password; // Temporary implementation
    }

    // Busca el usuario en la base de datos
    private async findUserInDatabase(username: string) {
        // @ts-ignore
        // TODO: Implementar búsqueda real en base de datos
        return { username: username, password: 'encrypted_password123' };
    }
}
```

```typescript
// ✅ Ejemplo con buenos comentarios
class EnhancedUserAuthentication {
    /**
     * Autenticación de dos factores que cumple con los estándares NIST SP 800-63B.
     * @throws AuthenticationError si las credenciales son inválidas
     * @throws RateLimitError si se exceden los intentos permitidos
     */
    async authenticateUser(credentials: UserCredentials): Promise<AuthenticationResult> {
        const rateLimiter = new AuthenticationRateLimiter();
        await rateLimiter.checkRateLimit(credentials.username);

        const user = await this.userRepository.findByUsername(credentials.username);
        if (!user) {
            // Usamos el mismo mensaje de error para prevenir enumeración de usuarios
            throw new AuthenticationError('Invalid credentials');
        }

        const passwordHasher = new PasswordHasher();
        const isPasswordValid = await passwordHasher.verify(
            credentials.password,
            user.hashedPassword
        );

        if (!isPasswordValid) {
            await rateLimiter.recordFailedAttempt(credentials.username);
            throw new AuthenticationError('Invalid credentials');
        }

        // Si el usuario tiene 2FA habilitado, verificamos el código
        if (user.hasTwoFactorEnabled) {
            return this.initiateTwoFactorAuth(user);
        }

        return this.generateAuthenticationResult(user);
    }

    private async initiateTwoFactorAuth(user: User): Promise<TwoFactorAuthenticationChallenge> {
        // TOTP implementado según RFC 6238
        const totpProvider = new TimeBasedOneTimePasswordProvider();
        return totpProvider.generateChallenge(user.totpSecret);
    }

    private async generateAuthenticationResult(user: User): Promise<AuthenticationResult> {
        const tokenGenerator = new JWTTokenGenerator();
        
        // Los tokens expiran en 1 hora por políticas de seguridad
        return {
            accessToken: await tokenGenerator.generate(user, '1h'),
            refreshToken: await this.refreshTokenRepository.create(user)
        };
    }
}

// Ejemplo de una clase de utilidad bien documentada cuando es necesario
/**
 * Implementa el algoritmo Argon2id para el hashing de contraseñas.
 * 
 * Configuración basada en las recomendaciones OWASP 2024:
 * - Memoria: 64 MB
 * - Iteraciones: 3
 * - Paralelismo: 4
 * 
 * @see https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
 */
class PasswordHasher {
    private readonly MEMORY_COST = 65536;    // 64 MB
    private readonly TIME_COST = 3;
    private readonly PARALLELISM = 4;
    
    async hash(password: string): Promise<string> {
        // La implementación específica va aquí
        return '';
    }
}
```

### 4. Manejo de Errores

Los errores deben manejarse de manera elegante y proporcionar mensajes significativos.

- Evaluación de Excepciones Verificadas: Aunque las excepciones verificadas pueden ser valiosas en el desarrollo de bibliotecas críticas, su uso en el desarrollo de aplicaciones generales puede introducir dependencias y complejidad innecesarias. Considera cuidadosamente las compensaciones y prioriza la simplicidad y mantenibilidad.
- Mensajes Contextuales de Excepción: Al lanzar excepciones, proporciona un contexto significativo para ayudar en la resolución de problemas y la depuración. Los mensajes de error claros e informativos mejoran la claridad y aceleran la resolución de problemas.
- Personalización de Clases de Excepción: Define clases de excepción basadas en las necesidades específicas de los llamadores, asegurando que las excepciones reflejen con precisión la naturaleza de los errores encontrados y se alineen con las expectativas de los componentes descendentes.
- Evitar Retornos Nulos: Evita devolver valores nulos, ya que pueden introducir ambigüedad y rutas de código propensas a errores. En su lugar, considera estrategias alternativas como el uso de tipos opcionales o lanzar excepciones para señalar ausencia o falla.
- Eliminación de Parámetros Nulos: Pasar valores nulos como argumentos de métodos debe evitarse siempre que sea posible, ya que puede llevar a NullPointerExceptions y oscurecer el comportamiento del código. Emplea técnicas de programación defensiva y establece contratos claros para prevenir problemas relacionados con nulos.

```typescript
// ❌ Ejemplo de mal manejo de errores
class PaymentProcessor {
    async processPayment(userId: string | null, amount: number | null, paymentInfo: any) {
        try {
            // Manejo de errores deficiente
            if (!userId) return null;
            if (!amount) return null;
            if (!paymentInfo) return null;

            const user = await this.getUser(userId);
            if (!user) return { error: 'Usuario no encontrado' };

            const balance = await this.checkBalance(userId);
            if (balance === null) return { error: 'Error al verificar balance' };
            if (balance < amount) return { error: 'Balance insuficiente' };

            const result = await this.executePayment(amount, paymentInfo);
            if (!result) return { error: 'Error en el pago' };

            return { success: true };
        } catch (error) {
            // Error genérico sin contexto
            console.error('Error en el proceso de pago');
            return { error: 'Error en el sistema' };
        }
    }

    private async getUser(userId: string) {
        try {
            // Simular búsqueda de usuario
            return null;
        } catch (error) {
            return null;
        }
    }

    private async checkBalance(userId: string) {
        // Retorna null en caso de error
        return null;
    }

    private async executePayment(amount: number, paymentInfo: any) {
        // Retorna false en caso de error
        return false;
    }
}
```

```typescript
// ✅ Ejemplo de buen manejo de errores
interface PaymentDetails {
    amount: number;
    currency: string;
    method: PaymentMethod;
    description?: string;
}

// Definición de excepciones personalizadas
class PaymentError extends Error {
    constructor(
        message: string,
        public readonly code: string,
        public readonly details?: Record<string, unknown>
    ) {
        super(message);
        this.name = 'PaymentError';
    }
}

class InsufficientFundsError extends PaymentError {
    constructor(available: number, required: number, currency: string) {
        super(
            `Fondos insuficientes. Disponible: ${available} ${currency}, Requerido: ${required} ${currency}`,
            'INSUFFICIENT_FUNDS',
            { available, required, currency }
        );
        this.name = 'InsufficientFundsError';
    }
}

class EnhancedPaymentProcessor {
    constructor(
        private readonly userService: UserService,
        private readonly balanceService: BalanceService,
        private readonly paymentGateway: PaymentGateway
    ) {}

    async processPayment(userId: string, paymentDetails: PaymentDetails): Promise<PaymentResult> {
        // Validación temprana de argumentos
        this.validateInputs(userId, paymentDetails);

        const user = await this.getValidatedUser(userId);
        await this.validateUserBalance(user, paymentDetails);

        try {
            const paymentResult = await this.paymentGateway.executePayment({
                user,
                ...paymentDetails,
                idempotencyKey: this.generateIdempotencyKey(userId, paymentDetails)
            });

            return this.createSuccessResult(paymentResult);
        } catch (error) {
            throw this.handlePaymentExecutionError(error);
        }
    }

    private validateInputs(userId: string, paymentDetails: PaymentDetails): void {
        if (!userId?.trim()) {
            throw new PaymentError(
                'ID de usuario no válido',
                'INVALID_USER_ID'
            );
        }

        if (paymentDetails.amount <= 0) {
            throw new PaymentError(
                'El monto del pago debe ser mayor a cero',
                'INVALID_AMOUNT',
                { amount: paymentDetails.amount }
            );
        }
    }

    private async getValidatedUser(userId: string): Promise<User> {
        try {
            const user = await this.userService.findById(userId);
            
            if (!user) {
                throw new PaymentError(
                    `Usuario no encontrado con ID: ${userId}`,
                    'USER_NOT_FOUND'
                );
            }

            if (!user.isActive) {
                throw new PaymentError(
                    'La cuenta de usuario está inactiva',
                    'INACTIVE_USER',
                    { userId, status: user.status }
                );
            }

            return user;
        } catch (error) {
            if (error instanceof PaymentError) {
                throw error;
            }
            throw new PaymentError(
                'Error al recuperar información del usuario',
                'USER_RETRIEVAL_ERROR',
                { userId, originalError: error.message }
            );
        }
    }

    private async validateUserBalance(user: User, paymentDetails: PaymentDetails): Promise<void> {
        const balance = await this.balanceService.getCurrentBalance(user.id);

        if (balance.amount < paymentDetails.amount) {
            throw new InsufficientFundsError(
                balance.amount,
                paymentDetails.amount,
                paymentDetails.currency
            );
        }
    }

    private generateIdempotencyKey(userId: string, paymentDetails: PaymentDetails): string {
        // Implementación de generación de clave de idempotencia
        return `${userId}-${Date.now()}`;
    }

    private createSuccessResult(paymentResult: PaymentGatewayResult): PaymentResult {
        return {
            success: true,
            transactionId: paymentResult.transactionId,
            timestamp: new Date(),
            details: paymentResult
        };
    }

    private handlePaymentExecutionError(error: unknown): PaymentError {
        if (error instanceof PaymentError) {
            return error;
        }

        // Manejar errores específicos del gateway de pago
        if (error instanceof PaymentGatewayError) {
            return new PaymentError(
                'Error al procesar el pago con el proveedor',
                'GATEWAY_ERROR',
                {
                    gatewayError: error.code,
                    gatewayMessage: error.message
                }
            );
        }

        // Error genérico con contexto
        return new PaymentError(
            'Error inesperado durante el procesamiento del pago',
            'UNEXPECTED_ERROR',
            { originalError: error instanceof Error ? error.message : String(error) }
        );
    }
}
```

### 5. Formateo

El formateo consistente mejora la legibilidad. Usa un linter y un formateador para mantener la consistencia.

- Comunicación a través del Formateo: El formateo del código sirve como un medio de comunicación entre desarrolladores, siendo la claridad primordial para transmitir la intención y la lógica de manera efectiva.
- Apertura Vertical: Adopta la apertura vertical para mejorar la legibilidad, asegurando que los conceptos estén lógicamente separados y fácilmente distinguibles dentro del código.
- Densidad Vertical: Apunta a la densidad vertical en líneas de código estrechamente relacionadas, enfatizando la cohesión entre conceptos relacionados y fomentando la comprensión.
- Gestión de la Distancia Vertical: Mantén funciones estrechamente relacionadas cerca unas de otras, con la función que llama posicionada por encima de la llamada para mantener el flujo lógico y la legibilidad. Las variables deben declararse cerca de sus puntos de uso para mayor claridad.
- Formateo Horizontal: Limita la longitud de las líneas a 100 o 120 caracteres para evitar el desplazamiento excesivo y mantener la legibilidad. El formateo horizontal consistente promueve la uniformidad y la claridad en la disposición del código.
- Directrices del Equipo: Aunque los desarrolladores individuales pueden tener preferencias personales de formateo, la adherencia a las reglas de formateo del equipo es esencial al colaborar dentro de un entorno de equipo. La consistencia en el formateo asegura bases de código cohesivas y facilita la colaboración sin problemas entre los miembros del equipo.

```typescript
// ❌ Ejemplo de código con mala práctica de formateo
function calculateDiscountedPrice(price:number, discount:number){const discountedPrice=price-(price*discount/100);return discountedPrice;}

const items=[{name:'Item1',price:100,discount:10},{name:'Item2',price:200,discount:20}];items.forEach(item=>{const finalPrice=calculateDiscountedPrice(item.price,item.discount);console.log(`Final price of ${item.name} is ${finalPrice}`);});
```

```typescript
// ✅ Ejemplo de código con buena práctica de formateo
function calculateDiscountedPrice(price: number, discount: number): number {
  const discountedPrice = price - (price * discount / 100);
  return discountedPrice;
}

const items = [
  { name: 'Item1', price: 100, discount: 10 },
  { name: 'Item2', price: 200, discount: 20 }
];

items.forEach(item => {
  const finalPrice = calculateDiscountedPrice(item.price, item.discount);
  console.log(`Final price of ${item.name} is ${finalPrice}`);
});
```

### Más ejemplos de buenas prácticas

Para obtener más ejemplos de buenas prácticas de Clean Code en TypeScript, puedes visitar el siguiente enlace: [Clean Code TypeScript](https://github.com/3xp1o1t/clean-code-typescript). Este repositorio ofrece una amplia variedad de ejemplos y recomendaciones para escribir código limpio y mantenible en TypeScript.

## Referencias

- [Clean Code: A Handbook of Agile Software Craftsmanship by Robert C. Martin](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
- [TypeScript Official Documentation](https://www.typescriptlang.org/docs/)
- [The Craft of Clean Code: Essential Principles for Software Developers](https://medium.com/@minuray10/the-craft-of-clean-code-essential-principles-for-software-developers-bcfb9ab6fc2f)