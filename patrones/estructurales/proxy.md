# Patrón de Diseño Proxy

## CONTEXTO Y FUNDAMENTOS

### Descripción
El patrón Proxy actúa como un intermediario o sustituto que controla el acceso a otro objeto. Este "sustituto" puede interceptar operaciones básicas como la creación, acceso o eliminación del objeto real, permitiendo añadir funcionalidad antes o después de que estas operaciones lleguen al objeto destino.

### Propósito Fundamental
- Control de acceso al objeto real
- Adición de funcionalidad sin modificar el objeto original
- Gestión de recursos costosos
- Validación previa a operaciones críticas

### Problema que Resuelve
En sistemas complejos, frecuentemente necesitamos:
- Controlar el acceso a objetos sensibles
- Retrasar la creación de objetos costosos hasta que sean realmente necesarios
- Implementar logging o monitoreo sin modificar clases existentes
- Validar operaciones antes de ejecutarlas en el objeto real

### Solución Propuesta
El patrón implementa una clase Proxy que:
1. Implementa la misma interfaz que el objeto real
2. Mantiene una referencia al objeto real
3. Controla el acceso y puede realizar acciones adicionales
4. Delega el trabajo real al objeto original

## COMPRENSIÓN Y APLICABILIDAD

### Analogía Práctica
Imagina un asistente personal que gestiona el acceso a un ejecutivo ocupado:
- El asistente (Proxy) recibe todas las solicitudes primero
- Filtra llamadas no importantes
- Programa reuniones según la disponibilidad
- Mantiene un registro de todas las interacciones
- Solo cuando es necesario, conecta con el ejecutivo (Objeto Real)

### Escenarios Ideales
1. **Lazy Loading**: Inicialización bajo demanda de recursos costosos
2. **Control de Acceso**: Validación de permisos antes de operaciones
3. **Logging**: Registro de operaciones sin modificar el objeto original
4. **Caching**: Almacenamiento en caché de resultados costosos
5. **Validación**: Verificación de parámetros antes de operaciones

### Criterios de Uso

#### Cuándo Usar
- Necesitas control granular sobre el acceso a un objeto
- Requieres funcionalidad adicional transparente
- Debes optimizar el uso de recursos costosos
- Necesitas logging o monitoreo sin modificar clases existentes

#### Cuándo Evitar
- Cuando la capa adicional de indirección no aporta valor
- En sistemas simples donde el control de acceso no es crítico
- Cuando el rendimiento es crítico y el overhead del proxy es significativo

## IMPLEMENTACIÓN Y EJEMPLOS

### Ejemplo Práctico: Sistema Bancario

#### Descripción
Implementaremos un sistema de acceso a cuentas bancarias donde necesitamos:
- Validar permisos antes de cada operación
- Registrar todas las transacciones
- Prevenir operaciones no autorizadas

#### Código Original (Sin Patrón)

```typescript
interface IBankAccount {
    getBalance(): number;
    deposit(amount: number): void;
    withdraw(amount: number): void;
}

class BankAccount implements IBankAccount {
    private balance: number = 0;

    getBalance(): number {
        return this.balance;
    }

    deposit(amount: number): void {
        this.balance += amount;
    }

    withdraw(amount: number): void {
        if (amount <= this.balance) {
            this.balance -= amount;
        } else {
            throw new Error("Fondos insuficientes");
        }
    }
}

// Uso directo
const account = new BankAccount();
account.deposit(1000);
account.withdraw(500);
```

#### Problemas del Código Actual
1. No hay validación de permisos
2. No se registran las operaciones
3. No hay límites de transacción
4. No hay prevención de fraude
5. No hay auditoría de operaciones

#### Implementación con Proxy

```typescript
interface IBankAccount {
    getBalance(): number;
    deposit(amount: number): void;
    withdraw(amount: number): void;
}

class BankAccount implements IBankAccount {
    private balance: number = 0;

    getBalance(): number {
        return this.balance;
    }

    deposit(amount: number): void {
        this.balance += amount;
    }

    withdraw(amount: number): void {
        if (amount <= this.balance) {
            this.balance -= amount;
        } else {
            throw new Error("Fondos insuficientes");
        }
    }
}

class BankAccountProxy implements IBankAccount {
    private realAccount: BankAccount;
    private userRole: string;

    constructor(userRole: string) {
        this.realAccount = new BankAccount();
        this.userRole = userRole;
    }

    private checkAccess(): boolean {
        // Validación de permisos según rol
        return ["admin", "accountHolder"].includes(this.userRole);
    }

    private logOperation(operation: string, amount?: number): void {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] ${operation} ${amount || ''} by ${this.userRole}`);
    }

    getBalance(): number {
        if (!this.checkAccess()) {
            throw new Error("Acceso denegado");
        }
        this.logOperation("Balance consulted");
        return this.realAccount.getBalance();
    }

    deposit(amount: number): void {
        if (!this.checkAccess()) {
            throw new Error("Acceso denegado");
        }
        if (amount > 10000) {
            throw new Error("Depósito excede el límite diario");
        }
        this.logOperation("Deposit", amount);
        this.realAccount.deposit(amount);
    }

    withdraw(amount: number): void {
        if (!this.checkAccess()) {
            throw new Error("Acceso denegado");
        }
        if (amount > 5000) {
            throw new Error("Retiro excede el límite diario");
        }
        this.logOperation("Withdrawal", amount);
        this.realAccount.withdraw(amount);
    }
}

// Uso con Proxy
const accountProxy = new BankAccountProxy("admin");
try {
    accountProxy.deposit(1000);
    accountProxy.withdraw(500);
} catch (error) {
    console.error(error);
}
```

#### Beneficios Obtenidos
1. **Control de Acceso**: Validación de permisos por rol
2. **Logging**: Registro automático de todas las operaciones
3. **Validación**: Límites de transacción implementados
4. **Seguridad**: Capa adicional de protección
5. **Auditoría**: Trazabilidad de operaciones

## EVALUACIÓN CRÍTICA

### Beneficios
1. **Separación de Responsabilidades**: El código de control de acceso está separado del objeto real
2. **Principio Open/Closed**: Permite extender funcionalidad sin modificar código existente
3. **Seguridad**: Facilita la implementación de controles de acceso
4. **Flexibilidad**: Permite cambiar el comportamiento en tiempo de ejecución

### Limitaciones
1. **Complejidad**: Añade una capa adicional de indirección
2. **Rendimiento**: Puede introducir overhead en operaciones simples
3. **Mantenimiento**: Requiere mantener sincronizadas las interfaces del proxy y objeto real

### Comparación con Alternativas
- **Decorator**: Enfocado en añadir funcionalidad, no en control de acceso
- **Facade**: Simplifica una interfaz compleja, no controla acceso
- **Middleware**: Similar pero más específico para flujos de proceso

### Recomendaciones
1. Usar interfaces para garantizar consistencia
2. Implementar logging detallado para debuggear
3. Considerar el impacto en rendimiento en operaciones críticas
4. Documentar claramente el propósito de cada proxy
5. Mantener la lógica de control de acceso simple y centralizada