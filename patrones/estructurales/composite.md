# Documentación Técnica: Patrón Composite en TypeScript

## CONTEXTO Y FUNDAMENTOS

### Descripción del Patrón
El patrón Composite permite componer objetos en estructuras de árbol para representar jerarquías de parte-todo. Los clientes pueden tratar objetos individuales y composiciones de objetos de manera uniforme, independientemente de su complejidad.

### Propósito Fundamental
- Crear estructuras jerárquicas de objetos donde tanto los elementos individuales como los grupos de elementos se tratan de forma homogénea
- Simplificar el manejo de estructuras recursivas complejas
- Proporcionar una interfaz única para interactuar con elementos simples y compuestos

### Problema que Resuelve
- Necesidad de manejar estructuras jerárquicas donde los elementos pueden contener otros elementos
- Complejidad en el tratamiento diferenciado de elementos simples y compuestos
- Dificultad para mantener consistencia en operaciones que afectan tanto a elementos individuales como a grupos

### Solución Propuesta
La solución se basa en tres componentes principales:
1. **Component**: Interfaz/clase abstracta que define operaciones comunes
2. **Leaf**: Implementación para objetos simples (sin hijos)
3. **Composite**: Implementación para objetos compuestos que pueden contener otros componentes

## COMPRENSIÓN Y APLICABILIDAD

### Analogía Práctica
Imagina un sistema de archivos:
- Los archivos son elementos simples (Leaf)
- Las carpetas son elementos compuestos (Composite)
- Tanto archivos como carpetas son componentes del sistema (Component)
- Puedes calcular el tamaño total de una carpeta, que incluirá el tamaño de todos sus archivos y subcarpetas

### Escenarios Ideales
- Sistemas de interfaz gráfica (UI) con componentes anidados
- Estructuras organizacionales jerárquicas
- Sistemas de menús multinivel
- Procesamiento de documentos con secciones y subsecciones

### Criterios de Uso

**Cuándo Usar**:
- Necesitas representar jerarquías parte-todo
- Los clientes deben ignorar la diferencia entre composiciones de objetos y objetos individuales
- La estructura tiene naturaleza recursiva

**Cuándo Evitar**:
- La estructura es plana sin jerarquías
- No necesitas tratar elementos simples y compuestos de manera uniforme
- La estructura es estática y no requiere modificaciones dinámicas

## IMPLEMENTACIÓN Y EJEMPLOS

### Ejemplo Práctico: Sistema Bancario

#### Descripción
Implementaremos un sistema para calcular comisiones en una estructura bancaria que incluye:
- Productos bancarios individuales (cuentas, préstamos)
- Paquetes de productos
- Portafolios de inversión

#### Código Original (Sin Patrón)

```typescript
// Enfoque inicial sin patrón
class BankAccount {
    constructor(
        private balance: number,
        private commissionRate: number
    ) {}

    calculateCommission(): number {
        return this.balance * this.commissionRate;
    }
}

class ProductPackage {
    private products: BankAccount[] = [];

    addProduct(product: BankAccount) {
        this.products.push(product);
    }

    calculateTotalCommission(): number {
        return this.products.reduce((sum, product) => 
            sum + product.calculateCommission(), 0);
    }
}

// Uso
const account1 = new BankAccount(1000, 0.01);
const account2 = new BankAccount(2000, 0.02);
const package1 = new ProductPackage();
package1.addProduct(account1);
package1.addProduct(account2);
```

#### Problemas del Código Actual
1. No se pueden anidar paquetes dentro de otros paquetes
2. Métodos diferentes para calcular comisiones en productos y paquetes
3. Difícil mantener consistencia al agregar nuevos tipos de productos
4. No hay una interfaz uniforme para todos los elementos

#### Solución con Patrón Composite



```typescript
// Component: Interfaz común para productos bancarios
interface BankProduct {
    calculateCommission(): number;
    getDescription(): string;
}

// Leaf: Productos bancarios individuales
class BankAccount implements BankProduct {
    constructor(
        private balance: number,
        private commissionRate: number,
        private accountType: string
    ) {}

    calculateCommission(): number {
        return this.balance * this.commissionRate;
    }

    getDescription(): string {
        return `${this.accountType} (Balance: $${this.balance})`;
    }
}

// Leaf: Otro tipo de producto bancario
class Loan implements BankProduct {
    constructor(
        private amount: number,
        private commissionRate: number
    ) {}

    calculateCommission(): number {
        return this.amount * this.commissionRate;
    }

    getDescription(): string {
        return `Loan (Amount: $${this.amount})`;
    }
}

// Composite: Paquete de productos bancarios
class ProductPackage implements BankProduct {
    private products: BankProduct[] = [];
    
    constructor(private packageName: string) {}

    addProduct(product: BankProduct): void {
        this.products.push(product);
    }

    removeProduct(product: BankProduct): void {
        const index = this.products.indexOf(product);
        if (index > -1) {
            this.products.splice(index, 1);
        }
    }

    calculateCommission(): number {
        return this.products.reduce(
            (sum, product) => sum + product.calculateCommission(), 
            0
        );
    }

    getDescription(): string {
        return `${this.packageName} (${this.products.length} products):\n` +
            this.products.map(p => `  - ${p.getDescription()}`).join('\n');
    }
}

// Ejemplo de uso
const savings = new BankAccount(1000, 0.01, "Savings");
const checking = new BankAccount(2000, 0.02, "Checking");
const personalLoan = new Loan(5000, 0.05);

// Crear un paquete básico
const basicPackage = new ProductPackage("Basic Package");
basicPackage.addProduct(savings);
basicPackage.addProduct(checking);

// Crear un paquete premium que incluye el paquete básico
const premiumPackage = new ProductPackage("Premium Package");
premiumPackage.addProduct(basicPackage);
premiumPackage.addProduct(personalLoan);

// Calcular comisiones totales
console.log(premiumPackage.getDescription());
console.log(`Total Commission: $${premiumPackage.calculateCommission()}`);

```

### Explicación de los Cambios y Beneficios

1. **Interfaz Unificada**: 
   - Todos los elementos implementan `BankProduct`
   - Operaciones consistentes a través de `calculateCommission()` y `getDescription()`

2. **Composición Flexible**:
   - Paquetes pueden contener otros paquetes
   - Estructura jerárquica ilimitada

3. **Mantenibilidad**:
   - Fácil agregar nuevos tipos de productos
   - Código más organizado y cohesivo

4. **Extensibilidad**:
   - Soporte para nuevas operaciones sin cambiar la estructura
   - Fácil integración de nuevos tipos de productos

## EVALUACIÓN CRÍTICA

### Beneficios
- Simplifica la complejidad del cliente al tratar con estructuras jerárquicas
- Facilita la adición de nuevos tipos de componentes
- Proporciona flexibilidad en la construcción de estructuras de árbol
- Cumple con el principio Open/Closed

### Limitaciones
- Puede hacer el diseño demasiado general
- Difícil restringir los componentes del árbol compuesto
- Puede complicar el manejo de ciclos en la estructura

### Comparación con Alternativas
- **Decorator**: Se centra en añadir comportamiento, no en composición
- **Facade**: Simplifica una interfaz compleja pero no maneja jerarquías
- **Bridge**: Separa abstracción de implementación, diferente propósito

### Recomendaciones
1. Usar TypeScript decorators para validación
2. Implementar mecanismos de caché para operaciones costosas
3. Considerar implementar el patrón Visitor para operaciones adicionales
4. Mantener un registro de la profundidad de la jerarquía
5. Implementar mecanismos de validación para evitar ciclos