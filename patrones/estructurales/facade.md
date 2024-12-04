# Patrón de Diseño Facade

## CONTEXTO Y FUNDAMENTOS

### Descripción
El patrón Facade (Fachada) es un patrón estructural que proporciona una interfaz unificada y simplificada para un conjunto de interfaces en un subsistema. Actúa como una "fachada" que oculta la complejidad del sistema subyacente, proporcionando un punto de entrada único y de alto nivel.

### Propósito Fundamental
- Simplificar el acceso a un sistema complejo
- Desacoplar el sistema de los clientes y otros subsistemas
- Proporcionar una interfaz unificada para un conjunto de interfaces
- Reducir la complejidad y las dependencias

### Problema que Resuelve
- **Complejidad de Integración**: Sistemas con múltiples subsistemas interdependientes
- **Acoplamiento Estrecho**: Clientes fuertemente acoplados a detalles de implementación
- **Dificultad de Mantenimiento**: Cambios en subsistemas que afectan a múltiples clientes
- **Complejidad de API**: Múltiples puntos de entrada y operaciones complejas

### Solución Propuesta
La solución consiste en introducir una capa de abstracción (Facade) que:
1. Encapsula la complejidad del sistema
2. Define una interfaz de alto nivel
3. Delega las solicitudes a los objetos apropiados
4. Coordina las interacciones entre subsistemas

## COMPRENSIÓN Y APLICABILIDAD

### Analogía Práctica
Imagina un restaurante de alta cocina:
- **Cliente**: El comensal que solo interactúa con el mesero
- **Facade**: El mesero que actúa como intermediario
- **Subsistemas**: Cocina, bar, caja, etc.
- **Operaciones Complejas**: Preparación de platos, facturación, etc.

El cliente no necesita conocer la complejidad de la cocina para disfrutar de su comida.

### Escenarios Ideales
1. Sistemas bancarios con múltiples servicios
2. Bibliotecas de integración de APIs
3. Sistemas legacy que requieren modernización
4. Aplicaciones con múltiples servicios externos

### Criterios de Uso

**Cuándo Usar**:
- Sistema con muchas dependencias y subsistemas
- Necesidad de una interfaz simplificada
- Deseo de desacoplar subsistemas
- Necesidad de capas de abstracción

**Cuándo Evitar**:
- Sistemas simples con pocas dependencias
- Cuando la simplicidad adicional no justifica la abstracción
- Cuando se requiere acceso directo a subsistemas
- En sistemas que cambian con mucha frecuencia

## IMPLEMENTACIÓN Y EJEMPLOS

### Ejemplo Bancario

#### 1. Descripción del Ejemplo
Implementaremos un sistema bancario que maneja:
- Verificación de cuenta
- Verificación de saldo
- Transferencias
- Notificaciones

#### 2. Código Sin Patrón

```typescript
// Subsistemas
class AccountVerification {
    verify(accountId: string): boolean {
        // Lógica de verificación
        return true;
    }
}

class BalanceChecker {
    checkBalance(accountId: string): number {
        // Lógica de verificación de saldo
        return 1000;
    }
}

class TransferSystem {
    makeTransfer(from: string, to: string, amount: number): boolean {
        // Lógica de transferencia
        return true;
    }
}

class NotificationService {
    sendNotification(userId: string, message: string): void {
        // Lógica de notificación
        console.log(`Notification sent to ${userId}: ${message}`);
    }
}

// Código cliente
class Client {
    makePayment(fromAccount: string, toAccount: string, amount: number): void {
        const accountVerifier = new AccountVerification();
        const balanceChecker = new BalanceChecker();
        const transferSystem = new TransferSystem();
        const notificationService = new NotificationService();

        if (!accountVerifier.verify(fromAccount) || !accountVerifier.verify(toAccount)) {
            throw new Error("Invalid account");
        }

        if (balanceChecker.checkBalance(fromAccount) < amount) {
            throw new Error("Insufficient funds");
        }

        if (transferSystem.makeTransfer(fromAccount, toAccount, amount)) {
            notificationService.sendNotification(fromAccount, "Transfer completed");
        }
    }
}
```

#### 3. Problemas del Código Actual
- Alto acoplamiento: El cliente conoce todos los subsistemas
- Violación de SRP: El cliente maneja múltiples responsabilidades
- Dificultad de mantenimiento: Cambios en subsistemas afectan al cliente
- Código duplicado: Otras operaciones necesitarían repetir lógica similar

#### 4. Implementación con Facade

```typescript
// BankingFacade
class BankingFacade {
    private accountVerification: AccountVerification;
    private balanceChecker: BalanceChecker;
    private transferSystem: TransferSystem;
    private notificationService: NotificationService;

    constructor() {
        this.accountVerification = new AccountVerification();
        this.balanceChecker = new BalanceChecker();
        this.transferSystem = new TransferSystem();
        this.notificationService = new NotificationService();
    }

    public makePayment(fromAccount: string, toAccount: string, amount: number): boolean {
        try {
            if (!this.verifyAccounts(fromAccount, toAccount)) {
                return false;
            }

            if (!this.checkSufficientFunds(fromAccount, amount)) {
                return false;
            }

            const success = this.transferSystem.makeTransfer(fromAccount, toAccount, amount);
            
            if (success) {
                this.notificationService.sendNotification(fromAccount, "Transfer completed");
                return true;
            }

            return false;
        } catch (error) {
            this.handleError(error);
            return false;
        }
    }

    private verifyAccounts(...accounts: string[]): boolean {
        return accounts.every(account => this.accountVerification.verify(account));
    }

    private checkSufficientFunds(account: string, amount: number): boolean {
        return this.balanceChecker.checkBalance(account) >= amount;
    }

    private handleError(error: any): void {
        console.error("Transaction failed:", error);
    }
}

// Código cliente simplificado
class Client {
    private bankingService: BankingFacade;

    constructor() {
        this.bankingService = new BankingFacade();
    }

    makePayment(fromAccount: string, toAccount: string, amount: number): void {
        if (!this.bankingService.makePayment(fromAccount, toAccount, amount)) {
            throw new Error("Payment failed");
        }
    }
}
```

#### 5. Beneficios Obtenidos
- Interfaz unificada y simple
- Encapsulamiento de la complejidad
- Mejor manejo de errores
- Código más mantenible y testeable
- Reducción de dependencias

## EVALUACIÓN CRÍTICA

### Beneficios Tangibles
1. **Simplicidad**: Interfaz clara y unificada
2. **Mantenibilidad**: Cambios localizados en la fachada
3. **Desacoplamiento**: Menor dependencia entre componentes
4. **Testabilidad**: Facilita el mockeo y testing unitario

### Limitaciones
1. **Overhead**: Capa adicional de abstracción
2. **Rigidez**: Puede limitar el acceso a funcionalidades específicas
3. **Complejidad**: La fachada puede volverse demasiado grande

### Comparación con Alternativas
- **Adapter**: Más específico para compatibilidad de interfaces
- **Mediator**: Mejor para comunicación entre componentes
- **Gateway**: Más orientado a recursos externos

### Recomendaciones de Mitigación
1. Mantener la fachada enfocada y cohesiva
2. Considerar múltiples fachadas para diferentes aspectos del sistema
3. Implementar logging y monitoreo en la fachada
4. Mantener la posibilidad de acceso directo a subsistemas cuando sea necesario