# Documentación Técnica: Patrón de Diseño Prototype

## Contexto y Fundamentos

### Descripción del Patrón
El patrón Prototype es un patrón de diseño creacional que permite crear nuevos objetos mediante la clonación de un objeto existente, conocido como prototipo. Este objeto prototipo actúa como plantilla para la creación de nuevas instancias, manteniendo el estado y comportamiento del objeto original.

### Propósito y Casos de Uso
El propósito fundamental es permitir la creación de nuevos objetos basados en una instancia existente, evitando la dependencia directa de las clases concretas y reduciendo el costo computacional de la creación de objetos complejos. Se utiliza frecuentemente en:

- Sistemas que requieren creación dinámica de objetos
- Escenarios donde la construcción de objetos es costosa computacionalmente
- Situaciones donde se necesitan múltiples variaciones de un objeto base

### Problema que Resuelve
El patrón Prototype aborda varios desafíos técnicos:
1. La creación repetitiva de objetos similares que requieren una configuración compleja
2. La necesidad de crear copias de objetos sin acoplar el código a sus clases específicas
3. El costo computacional de inicializar objetos complejos desde cero


## Comprensión y Aplicabilidad

### Analogía Práctica
Imagine una fábrica de documentos bancarios donde existe una plantilla maestra para cada tipo de documento. En lugar de crear cada nuevo documento desde cero, los empleados toman una copia de la plantilla maestra y la personalizan según sea necesario. La plantilla maestra representa el prototipo, y cada copia personalizada representa una instancia clonada.

### Escenarios Ideales de Aplicación
- Sistemas bancarios con múltiples tipos de cuentas basadas en templates
- Generación de documentos financieros con estructura similar pero contenido variable
- Configuración de productos financieros con características base comunes

### Criterios de Uso
Utilizar cuando:
- La creación de objetos es más eficiente por clonación que por construcción
- Se necesita independencia del sistema respecto a cómo se crean los productos
- Se requieren múltiples variaciones de objetos con estado similar

No utilizar cuando:
- Los objetos tienen pocos estados compartidos
- La clonación del objeto es más compleja que su creación directa
- La jerarquía de objetos es simple y no requiere flexibilidad en la creación

## Implementación y Ejemplos

### Ejemplo Práctico: Sistema de Cuentas Bancarias

En este ejemplo, vamos a implementar un sistema de creación de cuentas bancarias utilizando el patrón Prototype. Primero, veremos cómo se vería sin el patrón Prototype y luego implementaremos la solución con el patrón Prototype para mejorar la flexibilidad y eficiencia en la creación de cuentas bancarias.

```typescript
// Sin aplicar el patrón
class BankAccount {
    constructor(
        private accountType: string,
        private interestRate: number,
        private minimumBalance: number,
        private overdraftLimit: number,
        private notificationPreferences: string[],
        private securitySettings: { twoFactor: boolean; loginNotification: boolean }
    ) {}

    // Métodos complejos de configuración...
}

// Cada vez que necesitamos una nueva cuenta, debemos especificar todos los parámetros
const savingsAccount = new BankAccount(
    "savings",
    2.5,
    1000,
    0,
    ["email", "sms"],
    { twoFactor: true, loginNotification: true }
);

```

#### Implementación con el Patrón Prototype

En esta implementación, vamos a aplicar el patrón Prototype para crear prototipos de cuentas bancarias y clonarlos para personalizar las instancias. Esto nos permitirá crear nuevas cuentas basadas en prototipos existentes, evitando la necesidad de especificar todos los parámetros cada vez.

```typescript
// Aplicando el patrón Prototype
interface AccountPrototype {
    clone(): AccountPrototype;
}

class BankAccountPrototype implements AccountPrototype {
    constructor(
        protected accountType: string,
        protected interestRate: number,
        protected minimumBalance: number,
        protected overdraftLimit: number,
        protected notificationPreferences: string[],
        protected securitySettings: { twoFactor: boolean; loginNotification: boolean }
    ) {}

    clone(): BankAccountPrototype {
        return new BankAccountPrototype(
            this.accountType,
            this.interestRate,
            this.minimumBalance,
            this.overdraftLimit,
            [...this.notificationPreferences],
            { ...this.securitySettings }
        );
    }

    customize(modifications: Partial<BankAccountPrototype>): BankAccountPrototype {
        Object.assign(this, modifications);
        return this;
    }
}

// Creación de prototipos base
const savingsPrototype = new BankAccountPrototype(
    "savings",
    2.5,
    1000,
    0,
    ["email"],
    { twoFactor: true, loginNotification: true }
);

const checkingPrototype = new BankAccountPrototype(
    "checking",
    0.5,
    100,
    500,
    ["email"],
    { twoFactor: true, loginNotification: true }
);

// Uso del patrón
class AccountFactory {
    private prototypes: Map<string, BankAccountPrototype> = new Map();

    registerPrototype(name: string, prototype: BankAccountPrototype): void {
        this.prototypes.set(name, prototype);
    }

    createAccount(type: string, customizations?: Partial<BankAccountPrototype>): BankAccountPrototype {
        const prototype = this.prototypes.get(type);
        if (!prototype) {
            throw new Error(`No prototype found for account type: ${type}`);
        }
        
        const account = prototype.clone();
        if (customizations) {
            account.customize(customizations);
        }
        return account;
    }
}

// Ejemplo de uso
const factory = new AccountFactory();
factory.registerPrototype("savings", savingsPrototype);
factory.registerPrototype("checking", checkingPrototype);

// Crear una cuenta de ahorro personalizada
const premiumSavings = factory.createAccount("savings", {
    interestRate: 3.0,
    notificationPreferences: ["email", "sms", "push"]
});

```

### Cambios y Beneficios

#### Cambios Realizados

- Se ha agregado un nuevo método `clone()` a la clase `BankAccountPrototype` para permitir la clonación de prototipos.
- Se ha agregado un nuevo método `customize()` a la clase `BankAccountPrototype` para permitir la personalización de los prototipos.
- Se ha agregado un nuevo método `registerPrototype()` a la clase `AccountFactory` para registrar prototipos de cuentas bancarias.
- Se ha agregado un nuevo método `createAccount()` a la clase `AccountFactory` para crear cuentas bancarias basadas en prototipos existentes.

#### Beneficios Obtenidos

- El patrón de diseño de fábrica permite la creación de cuentas bancarias personalizadas basadas en prototipos existentes.
- El uso de prototipos permite la reutilización de código y la creación de nuevas instancias de manera eficiente.
- La personalización de los prototipos permite adaptar las cuentas bancarias a las necesidades específicas de los clientes.
- El uso de la fábrica permite la creación de cuentas bancarias de manera flexible y dinámica.

## Evaluación Crítica

### Beneficios

1. Reduce el costo de creación de objetos complejos
2. Permite agregar o eliminar productos en tiempo de ejecución
3. Proporciona una alternativa a la herencia para reutilización de código
4. Reduce la duplicación de código de inicialización

### Limitaciones

1. La clonación de objetos complejos con referencias circulares puede ser desafiante
2. La implementación de la clonación profunda puede ser compleja
3. Puede introducir complejidad adicional en el sistema si no se gestiona adecuadamente

### Comparación con Alternativas

- Factory Method: Más apropiado cuando la creación de objetos es simple y directa
- Builder: Mejor cuando se necesita construir objetos paso a paso con diferentes representaciones
- Abstract Factory: Preferible cuando se necesitan familias completas de objetos relacionados

### Recomendaciones de Mitigación

1. Implementar mecanismos de clonación profunda cuando sea necesario
2. Mantener una clara separación entre los prototipos y sus clones
3. Documentar claramente las dependencias y relaciones entre objetos
4. Utilizar un registro centralizado de prototipos para mejor gestión
5. Considerar la implementación de un sistema de caché para prototipos frecuentemente utilizados
