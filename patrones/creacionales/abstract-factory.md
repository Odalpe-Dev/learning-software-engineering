# Patrón Abstract Factory en TypeScript

## Contexto y Fundamentos

### Descripción del Patrón
El patrón Abstract Factory es un patrón de diseño creacional que proporciona una interfaz para crear familias de objetos relacionados o dependientes sin especificar sus clases concretas. Actúa como una "fábrica de fábricas", permitiendo la creación consistente de productos que comparten una temática común.

### Propósito Fundamental
El objetivo principal es encapsular un grupo de fábricas individuales que tienen un tema común sin especificar sus clases concretas. Esto facilita la creación de objetos que deben funcionar juntos mientras mantiene la consistencia entre productos relacionados.

### Problema que Resuelve
En sistemas complejos, frecuentemente necesitamos crear conjuntos de objetos que:
- Deben trabajar juntos de manera cohesiva
- Pertenecen a una misma familia o tema
- Requieren una consistencia garantizada en su implementación
- Pueden tener múltiples variantes o familias

Por ejemplo, en una aplicación multiplataforma, necesitamos crear interfaces de usuario que mantengan una apariencia consistente según el sistema operativo (Windows, MacOS, Linux), pero con componentes que se ajusten a cada plataforma.

### Solución Propuesta
El patrón propone:
1. Definir interfaces para cada tipo de producto
2. Crear una fábrica abstracta que declare métodos para crear cada producto
3. Implementar fábricas concretas para cada variante de la familia de productos
4. El código cliente trabaja con las interfaces, no con las implementaciones

## Comprensión y Aplicabilidad

### Analogía Práctica
Imaginemos una empresa de mobiliario que produce líneas completas de muebles (Medieval, Moderno, Industrial). Cada línea incluye los mismos tipos de muebles (silla, mesa, sofá), pero con diseños consistentes dentro de su estilo. Cada "fábrica" produce una línea completa, asegurando la coherencia estilística.

### Escenarios Ideales
- Sistemas que deben soportar múltiples familias de productos
- Aplicaciones multiplataforma con interfaces específicas
- Frameworks que requieren consistencia entre componentes
- Sistemas que necesitan cambiar familias completas de objetos en tiempo de ejecución

### Criterios de Uso

**Cuándo Usar:**
- Se necesita garantizar la compatibilidad entre productos relacionados
- El sistema debe ser configurado con una de varias familias de productos
- Se quiere proporcionar una biblioteca de productos revelando solo sus interfaces

**Cuándo Evitar:**
- El sistema solo necesita crear un tipo de producto
- No hay familias claras de productos relacionados
- Las variaciones entre productos son mínimas

## Implementación y Ejemplos

### Ejemplo Práctico: Sistema Bancario

Imaginemos un sistema bancario que ofrece diferentes productos financieros (cuentas, tarjetas, seguros) para clientes premium y básicos. Implementaremos un sistema que crea productos bancarios para diferentes tipos de clientes.

```typescript
Código Sin el Patrón
// Implementación sin patrón - Código acoplado
class BankAccount {
  constructor(accountType: string) {
    if (accountType === 'premium') {
      this.interestRate = 2.5;
      this.minimumBalance = 10000;
    } else if (accountType === 'basic') {
      this.interestRate = 0.5;
      this.minimumBalance = 100;
    }
  }
}

class CreditCard {
  constructor(accountType: string) {
    if (accountType === 'premium') {
      this.limit = 50000;
      this.cashback = 2;
    } else if (accountType === 'basic') {
      this.limit = 5000;
      this.cashback = 0.5;
    }
  }
}

//uso
const premiumAccount = new BankAccount('premium');
const basicCreditCard = new CreditCard('basic');

console.log(premiumAccount.interestRate); // 2.5
console.log(basicCreditCard.limit); // 5000

```

#### Implementación con Abstract Factory

```typescript
// 1. Interfaces de Productos
interface IBankAccount {
  getInterestRate(): number;
  getMinimumBalance(): number;
}

interface ICreditCard {
  getCreditLimit(): number;
  getAnnualFee(): number;
  getCashbackRate(): number;
}

//Seguro
interface IInsurance {
  getCoverage(): number;
  getMonthlyPremium(): number;
}

// 2. Fábrica Abstracta
/*** 
* IBankingProductFactory es una interfaz que define métodos para crear diferentes productos bancarios: cuentas bancarias (IBankAccount), tarjetas de crédito (ICreditCard) y seguros (IInsurance). Esto asegura que cualquier fábrica concreta que implemente esta interfaz proporcionará estos métodos.
 */
interface IBankingProductFactory {
  createAccount(): IBankAccount;
  createCreditCard(): ICreditCard;
  createInsurance(): IInsurance;
}

// 3. Productos Concretos - Premium
class PremiumAccount implements IBankAccount {
  getInterestRate(): number {
    return 2.5;
  }
  
  getMinimumBalance(): number {
    return 10000;
  }
}

class PremiumCreditCard implements ICreditCard {
  getCreditLimit(): number {
    return 50000;
  }
  
  getAnnualFee(): number {
    return 250;
  }
  
  getCashbackRate(): number {
    return 2.0;
  }
}

class PremiumInsurance implements IInsurance {
  getCoverage(): number {
    return 1000000;
  }
  
  getMonthlyPremium(): number {
    return 150;
  }
}

// 4. Fábrica Concreta - Premium
class PremiumBankingFactory implements IBankingProductFactory {
  createAccount(): IBankAccount {
    return new PremiumAccount();
  }
  
  createCreditCard(): ICreditCard {
    return new PremiumCreditCard();
  }
  
  createInsurance(): IInsurance {
    return new PremiumInsurance();
  }
}

// 5. Cliente
class BankingApplication {
  private factory: IBankingProductFactory;
  
  constructor(factory: IBankingProductFactory) {
    this.factory = factory;
  }
  
  createClientPortfolio(): void {
    const account = this.factory.createAccount();
    const creditCard = this.factory.createCreditCard();
    const insurance = this.factory.createInsurance();
    
    console.log(`Created portfolio with:
      Account: ${account.getInterestRate()}% interest
      Credit Card: $${creditCard.getCreditLimit()} limit
      Insurance: $${insurance.getCoverage()} coverage`);
  }
}

// 6. Uso
const premiumClient = new BankingApplication(new PremiumBankingFactory());
premiumClient.createClientPortfolio();

```

#### Beneficios de la implementación con Abstract Factory

- **Consistencia**: Asegura que todos los productos creados por una fábrica concreta sean compatibles entre sí.
- **Extensibilidad**: Facilita la adición de nuevas familias de productos (por ejemplo, productos estándar) sin modificar el código existente.
- **Desacoplamiento**: Separa la creación de objetos de su uso, permitiendo cambiar las implementaciones concretas sin afectar al cliente.
- **Mantenimiento**: Mejora la mantenibilidad del código al centralizar la lógica de creación de objetos en fábricas concretas.

### Escenario Complejo: Sistema de Procesamiento de Pagos Ecommerce

Imaginemos un sistema de procesamiento de pagos para una plataforma de ecommerce que debe manejar transacciones, detección de fraudes y notificaciones de confirmación. Implementaremos un sistema que procesa transacciones de pago utilizando diferentes proveedores de servicios de pago.

```typescript
interface IPaymentProcessor {
  processPayment(amount: number): Promise<boolean>;
  refundPayment(transactionId: string): Promise<boolean>;
  getTransactionFee(): number;
}

interface IFraudDetector {
  analyzeTransaction(data: TransactionData): Promise<RiskScore>;
  getThreshold(): number;
}

interface INotificationService {
  sendConfirmation(to: string, data: PaymentData): Promise<void>;
  getNotificationChannel(): string;
}

interface IPaymentProcessingFactory {
  createPaymentProcessor(): IPaymentProcessor;
  createFraudDetector(): IFraudDetector;
  createNotificationService(): INotificationService;
}

class StripeProcessingFactory implements IPaymentProcessingFactory {
  createPaymentProcessor(): IPaymentProcessor {
    return new StripePaymentProcessor();
  }
  
  createFraudDetector(): IFraudDetector {
    return new StripeFraudDetector();
  }
  
  createNotificationService(): INotificationService {
    return new StripeNotificationService();
  }
}

class PayPalProcessingFactory implements IPaymentProcessingFactory {
  createPaymentProcessor(): IPaymentProcessor {
    return new PayPalPaymentProcessor();
  }
  
  createFraudDetector(): IFraudDetector {
    return new PayPalFraudDetector();
  }
  
  createNotificationService(): INotificationService {
    return new PayPalNotificationService();
  }
}

class PaymentProcessor {
  private factory: IPaymentProcessingFactory;
  
  constructor(factory: IPaymentProcessingFactory) {
    this.factory = factory;
  }
  
  async processTransaction(amount: number, userData: UserData): Promise<Result> {
    const processor = this.factory.createPaymentProcessor();
    const fraudDetector = this.factory.createFraudDetector();
    const notificationService = this.factory.createNotificationService();
    
    const riskScore = await fraudDetector.analyzeTransaction({
      amount,
      userData
    });
    
    if (riskScore.value < fraudDetector.getThreshold()) {
      const success = await processor.processPayment(amount);
      if (success) {
        await notificationService.sendConfirmation(
          userData.email,
          { amount, transactionId: generateId() }
        );
      }
      return { success, fee: processor.getTransactionFee() };
    }
    
    return { success: false, reason: 'High risk transaction' };
  }
}
```

## Evaluación Crítica

### Beneficios

1. **Aislamiento de código concreto**: El código cliente está completamente aislado de las implementaciones específicas.
2. **Consistencia garantizada**: Asegura que los productos utilizados sean compatibles entre sí.
3. **Principio de Responsabilidad Única**: Concentra la creación de productos en un lugar específico.
4. **Principio Abierto/Cerrado**: Permite agregar nuevas variantes sin modificar el código existente.

### Limitaciones

1. **Complejidad inicial**: Requiere crear muchas interfaces y clases.
2. **Rigidez en la estructura**: Una vez definida la interfaz de la fábrica, es difícil agregar nuevos tipos de productos.
3. **Overhead**: Para casos simples, puede resultar en exceso de código.

### Comparación con Alternativas

- **Factory Method**: Más simple pero menos flexible para familias de productos.
- **Builder**: Mejor para objetos complejos con múltiples configuraciones.
- **Prototype**: Más adecuado para clonar objetos existentes.

### Recomendaciones

1. **Planificación inicial**: Definir cuidadosamente las interfaces de productos antes de implementar.
2. **Uso de genéricos**: Implementar con TypeScript generics para mayor flexibilidad.
3. **Documentación clara**: Mantener documentación sobre las familias de productos y sus relaciones.
4. **Implementación gradual**: Comenzar con una familia básica y expandir según necesidad.