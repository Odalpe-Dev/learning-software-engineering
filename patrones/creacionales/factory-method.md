# Patrón de Diseño Factory Method

## CONTEXTO Y FUNDAMENTOS

### Descripción del Patrón

El Factory Method es un patrón de diseño creacional que proporciona una interfaz para crear objetos en una superclase, mientras permite a las subclases alterar el tipo de objetos que se crearán. Encapsula la lógica de creación de objetos en métodos específicos, permitiendo la extensión y modificación del proceso de creación sin alterar el código cliente.

### Propósito Fundamental

El objetivo principal es resolver el problema de crear objetos sin especificar sus clases concretas exactas, delegando la creación a subclases especializadas. Esto permite mantener un bajo acoplamiento entre el código cliente y las clases concretas de los productos.

### Problema que Resuelve

En sistemas complejos, la creación directa de objetos mediante el operador `new` puede generar varios desafíos:

1. Acoplamiento estrecho entre el código cliente y las clases concretas
2. Dificultad para cambiar implementaciones sin modificar código existente
3. Complejidad en la gestión de familias de productos relacionados
4. Duplicación de lógica de creación de objetos en múltiples lugares

### Solución Propuesta

La estructura del patrón se compone de:

1. Creator (Creador): Declara el método de fábrica abstracto que retorna objetos del tipo Product
2. ConcreteCreator (Creador Concreto): Implementa el método de fábrica para crear instancias específicas
3. Product (Producto): Define la interfaz de los objetos creados
4. ConcreteProduct (Producto Concreto): Implementa la interfaz Product

## COMPRENSIÓN Y APLICABILIDAD

### Analogía Práctica

Imaginemos una fábrica de muebles que produce diferentes tipos de sillas. La fábrica principal (Creator) define el proceso general de fabricación, pero cada línea de producción especializada (ConcreteCreator) conoce los detalles específicos para crear cada tipo de silla (ConcreteProduct). Un cliente puede solicitar una silla sin necesidad de conocer los detalles específicos de su fabricación.

### Escenarios de Aplicación

El patrón es especialmente útil en situaciones donde:

1. Se desconoce de antemano los tipos exactos y dependencias de los objetos con los que trabajará el código
2. Se quiere proporcionar a los usuarios de una biblioteca o framework una forma de extender sus componentes internos
3. Se necesita reutilizar objetos existentes en lugar de reconstruirlos cada vez
4. Se busca encapsular la lógica de creación de objetos complejos

## IMPLEMENTACIÓN Y EJEMPLOS

### Ejemplo Práctico: Sistema de Notificaciones

#### Descripción
Implementaremos un sistema de notificaciones que puede enviar mensajes a través de diferentes canales (email, SMS, push notifications).

#### Código Sin el Patrón

```typescript
class EmailNotification {
    send(message: string) {
        console.log(`Enviando email: ${message}`);
    }
}

class SMSNotification {
    send(message: string) {
        console.log(`Enviando SMS: ${message}`);
    }
}

// Código cliente
class NotificationService {
    sendNotification(type: string, message: string) {
        if (type === 'email') {
            const notification = new EmailNotification();
            notification.send(message);
        } else if (type === 'sms') {
            const notification = new SMSNotification();
            notification.send(message);
        }
    }
}
```

#### Solución con Factory Method



```typescript
// Interfaz base para todas las notificaciones
interface INotification {
    send(message: string): void;
}

// Productos concretos
class EmailNotification implements INotification {
    send(message: string): void {
        console.log(`[Email] Enviando: ${message}`);
    }
}

class SMSNotification implements INotification {
    send(message: string): void {
        console.log(`[SMS] Enviando: ${message}`);
    }
}

class PushNotification implements INotification {
    send(message: string): void {
        console.log(`[Push] Enviando: ${message}`);
    }
}

// Creador abstracto
abstract class NotificationFactory {
    // Factory Method
    abstract createNotification(): INotification;
    
    // Método que utiliza el factory method
    sendNotification(message: string): void {
        const notification = this.createNotification();
        notification.send(message);
    }
}

// Creadores concretos
class EmailNotificationFactory extends NotificationFactory {
    createNotification(): INotification {
        return new EmailNotification();
    }
}

class SMSNotificationFactory extends NotificationFactory {
    createNotification(): INotification {
        return new SMSNotification();
    }
}

class PushNotificationFactory extends NotificationFactory {
    createNotification(): INotification {
        return new PushNotification();
    }
}

// Ejemplo de uso
function clientCode(factory: NotificationFactory, message: string) {
    factory.sendNotification(message);
}

// Uso
const emailFactory = new EmailNotificationFactory();
const smsFactory = new SMSNotificationFactory();
const pushFactory = new PushNotificationFactory();

clientCode(emailFactory, "¡Hola mundo!");  // Output: [Email] Enviando: ¡Hola mundo!
clientCode(smsFactory, "¡Hola mundo!");    // Output: [SMS] Enviando: ¡Hola mundo!
clientCode(pushFactory, "¡Hola mundo!");   // Output: [Push] Enviando: ¡Hola mundo!

```

### Escenario Complejo: Sistema de Notificaciones con Configuración

```typescript
// Configuraciones específicas para cada tipo de notificación
interface NotificationConfig {
    priority: 'high' | 'medium' | 'low';
    retryCount: number;
}

interface INotification {
    send(message: string): void;
    configure(config: NotificationConfig): void;
}

abstract class NotificationFactory {
    protected config: NotificationConfig;

    constructor(config: NotificationConfig) {
        this.config = config;
    }

    abstract createNotification(): INotification;

    sendNotification(message: string): void {
        const notification = this.createNotification();
        notification.configure(this.config);
        notification.send(message);
    }
}

class EnhancedEmailNotification implements INotification {
    private config!: NotificationConfig;

    configure(config: NotificationConfig): void {
        this.config = config;
    }

    send(message: string): void {
        console.log(`[Email] Prioridad: ${this.config.priority}, Reintentos: ${this.config.retryCount}`);
        console.log(`[Email] Enviando: ${message}`);
    }
}

class EnhancedEmailFactory extends NotificationFactory {
    createNotification(): INotification {
        return new EnhancedEmailNotification();
    }
}

// Uso del sistema avanzado
const config: NotificationConfig = {
    priority: 'high',
    retryCount: 3
};

const enhancedEmailFactory = new EnhancedEmailFactory(config);
enhancedEmailFactory.sendNotification("Mensaje importante");

```

## EVALUACIÓN CRÍTICA

### Beneficios

1. Flexibilidad y Extensibilidad: Facilita la adición de nuevos tipos de productos sin modificar el código existente
2. Encapsulamiento: Oculta la lógica de creación de objetos del código cliente
3. Principio de Responsabilidad Única: Separa el código de construcción del código de uso del producto
4. Mantenibilidad: Centraliza la lógica de creación de objetos

### Limitaciones

1. Complejidad Adicional: Puede resultar en la creación de muchas subclases
2. Sobrecarga de Código: Requiere más código inicial comparado con la creación directa de objetos
3. Abstracción Excesiva: En casos simples, puede ser una solución demasiado elaborada

### Comparación con Alternativas

1. Simple Factory: Más simple pero menos flexible y extensible
2. Abstract Factory: Más complejo pero mejor para familias de objetos relacionados
3. Builder: Mejor para objetos con múltiples configuraciones y pasos de construcción

### Recomendaciones de Mitigación

1. Evaluar la necesidad real de flexibilidad antes de implementar el patrón
2. Considerar el uso de Simple Factory para casos más sencillos
3. Documentar claramente la jerarquía de clases y sus responsabilidades
4. Utilizar nombres descriptivos para las clases Factory y sus productos
5. Implementar pruebas unitarias exhaustivas para cada Factory y producto