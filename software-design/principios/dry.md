# Principio DRY (Don't Repeat Yourself)

El principio DRY (Don't Repeat Yourself) es un concepto fundamental en la programación orientada a objetos y en el desarrollo de software en general. Este principio establece que cada pieza de conocimiento debe tener una única representación en nuestro sistema. En otras palabras, la duplicación de lógica, estructuras de datos y conocimiento debe ser evitada a toda costa.

El DRY se enfoca en reducir la duplicación de código y mejorar la mantenibilidad del software. Al seguir este principio, podemos reducir la cantidad de errores, mejorar la coherencia del código y facilitar la evolución del sistema a lo largo del tiempo.

## Fundamentos del Principio DRY

El principio DRY, acuñado por Andy Hunt y Dave Thomas en "The Pragmatic Programmer"[^1], establece que cada pieza de lógica en nuestro sistema debe tener una única representación. La duplicación no se refiere solo a copiar y pegar código, sino también a la repetición de lógica de negocio, estructuras de datos y conocimiento. El objetivo es eliminar la redundancia en todos los niveles.

### Tipos de Duplicación

1. **Duplicación Directa**: Copiar y pegar código.
2. **Duplicación Estructural**: Mismo patrón en diferentes lugares.
3. **Duplicación de Conocimiento**: Reglas de negocio repetidas.
4. **Duplicación de Interfaz**: APIs similares para funcionalidades similares.

[^1]: Hunt, A., & Thomas, D. (1999). The Pragmatic Programmer. Addison-Wesley.

### Ejemplos Prácticos

#### 1. Duplicación de Validaciones

```typescript
// ❌ Violación del principio DRY
class UserService {
    createUser(user: User) {
        // Validación de email
        if (!user.email.includes('@') || !user.email.includes('.')) {
            throw new Error('Invalid email');
        }
        // ... lógica de creación
    }

    updateUser(user: User) {
        // Misma validación duplicada
        if (!user.email.includes('@') || !user.email.includes('.')) {
            throw new Error('Invalid email');
        }
        // ... lógica de actualización
    }
}

// ✅ Aplicando DRY
class UserService {
    private isValidEmail(email: string): boolean {
        return email.includes('@') && email.includes('.');
    }

    createUser(user: User) {
        if (!this.isValidEmail(user.email)) {
            throw new Error('Invalid email');
        }
        // ... lógica de creación
    }

    updateUser(user: User) {
        if (!this.isValidEmail(user.email)) {
            throw new Error('Invalid email');
        }
        // ... lógica de actualización
    }
}
```

#### 2. Duplicación de Lógica de Negocio

```typescript
// ❌ Violación del principio DRY
class OrderService {
    calculateRegularOrderTotal(order: Order): number {
        let total = 0;
        for (const item of order.items) {
            total += item.price * item.quantity;
        }
        if (total > 1000) {
            total *= 0.9; // 10% descuento
        }
        return total;
    }

    calculateVIPOrderTotal(order: Order): number {
        let total = 0;
        for (const item of order.items) {
            total += item.price * item.quantity;
        }
        if (total > 1000) {
            total *= 0.85; // 15% descuento
        }
        return total;
    }
}

// ✅ Aplicando DRY
class OrderService {
    private calculateSubtotal(items: OrderItem[]): number {
        return items.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );
    }

    private applyDiscount(amount: number, discountRate: number): number {
        return amount * (1 - discountRate);
    }

    calculateOrderTotal(order: Order, isVIP: boolean): number {
        const subtotal = this.calculateSubtotal(order.items);
        const discountRate = isVIP ? 0.15 : 0.1;
        
        return subtotal > 1000 
            ? this.applyDiscount(subtotal, discountRate)
            : subtotal;
    }
}
```

#### 3. Encapsulación de Configuración

```typescript
// ❌ Violación del principio DRY
class PaymentProcessor {
    processPayPal(payment: Payment) {
        const apiUrl = 'https://api.paypal.com/v1';
        const apiKey = 'paypal_key_123';
        // ... lógica de procesamiento
    }

    refundPayPal(payment: Payment) {
        const apiUrl = 'https://api.paypal.com/v1';
        const apiKey = 'paypal_key_123';
        // ... lógica de reembolso
    }
}

// ✅ Aplicando DRY
class PaymentConfig {
    static readonly PAYPAL = {
        apiUrl: 'https://api.paypal.com/v1',
        apiKey: 'paypal_key_123'
    } as const;
}

class PaymentProcessor {
    processPayPal(payment: Payment) {
        const { apiUrl, apiKey } = PaymentConfig.PAYPAL;
        // ... lógica de procesamiento
    }

    refundPayPal(payment: Payment) {
        const { apiUrl, apiKey } = PaymentConfig.PAYPAL;
        // ... lógica de reembolso
    }
}
```

### 4. Utilizando Decoradores para DRY

```typescript
// ✅ Ejemplo avanzado usando decoradores
function ValidateEmail() {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = function(...args: any[]) {
            const user = args[0];
            if (!user.email.includes('@') || !user.email.includes('.')) {
                throw new Error('Invalid email');
            }
            return originalMethod.apply(this, args);
        };

        return descriptor;
    };
}

class UserService {
    @ValidateEmail()
    createUser(user: User) {
        // Lógica de creación
    }

    @ValidateEmail()
    updateUser(user: User) {
        // Lógica de actualización
    }
}
```

### Beneficios de Aplicar DRY

1. **Mantenibilidad Mejorada**
   - Cambios en un solo lugar
   - Menor probabilidad de errores
   - Código más consistente

2. **Mejor Testabilidad**
   - Menos código para probar
   - Tests más focalizados
   - Mayor cobertura con menos tests

3. **Código más Limpio**
   - Mejor organización
   - Mayor claridad
   - Menos líneas de código

### Precauciones

1. No sobre-aplicar DRY
   - A veces, cierta duplicación es aceptable
   - Evaluar el costo/beneficio de la abstracción
   - Mantener el código simple y comprensible

2. Cuidado con abstracciones prematuras
   - Esperar a ver patrones claros
   - No anticipar necesidades futuras
   - Mantener el balance entre flexibilidad y simplicidad
