# Patrón de Diseño Decorator en TypeScript

## CONTEXTO Y FUNDAMENTOS

### Descripción del Patrón
El patrón Decorator es un patrón estructural que permite agregar nuevos comportamientos a objetos existentes dinámicamente, colocando estos objetos dentro de objetos contenedores especiales que contienen los comportamientos adicionales.

### Propósito Fundamental
- Extender la funcionalidad de objetos en tiempo de ejecución
- Agregar responsabilidades adicionales a objetos de manera flexible
- Proporcionar una alternativa flexible a la herencia para extender funcionalidad

### Problema que Resuelve
En el desarrollo de software, frecuentemente necesitamos agregar funcionalidades a objetos específicos sin alterar su estructura básica o afectar a otros objetos de la misma clase. La herencia no siempre es la mejor solución porque:
- Es estática y se aplica a toda la clase
- Puede llevar a una explosión de subclases
- No permite cambiar comportamientos en tiempo de ejecución

### Solución Propuesta
El patrón Decorator propone:
1. Mantener una interfaz común entre el objeto original y el decorador
2. Implementar decoradores que envuelvan el objeto original
3. Cada decorador puede agregar su propio comportamiento antes o después de delegar al objeto decorado
4. Los decoradores son apilables y componibles

## COMPRENSIÓN Y APLICABILIDAD

### Analogía del Mundo Real
Piensa en cómo personalizas un café en una cafetería:
- El café básico es tu componente base
- Cada adicional (leche, azúcar, canela, etc.) es un decorador
- Puedes agregar múltiples decoradores en cualquier orden
- El precio final refleja la suma de todos los decoradores

### Escenarios Ideales
- Sistemas que requieren composición flexible de comportamientos
- Cuando necesitas agregar o remover responsabilidades en tiempo de ejecución
- Cuando la herencia resulta poco práctica por generar demasiadas subclases
- Sistemas que necesitan capas de funcionalidad (logging, validación, cache, etc.)

### Criterios de Uso

#### Cuándo Usar
- Necesitas modificar comportamientos en tiempo de ejecución
- Quieres evitar la explosión de subclases
- Necesitas combinar comportamientos de manera flexible
- Las modificaciones deben ser transparentes para el código cliente

#### Cuándo Evitar
- Cuando la lógica adicional es fija y no necesita ser configurable
- Si el sistema es simple y no requiere flexibilidad en tiempo de ejecución
- Cuando los cambios de comportamiento son poco frecuentes

## IMPLEMENTACIÓN Y EJEMPLOS

### Ejemplo Práctico: Sistema Bancario de Notificaciones

#### Descripción del Ejemplo
Implementaremos un sistema de notificaciones bancarias donde diferentes tipos de transacciones requieren diferentes niveles de notificación.

#### Código Original (Sin Patrón)

```typescript
// Implementación básica sin el patrón
class BankNotification {
  private message: string;
  private isUrgent: boolean;
  private requiresSMS: boolean;
  private requiresEmail: boolean;

  constructor(message: string) {
    this.message = message;
    this.isUrgent = false;
    this.requiresSMS = false;
    this.requiresEmail = false;
  }

  send(): void {
    let finalMessage = this.message;
    
    if (this.isUrgent) {
      finalMessage = "URGENTE: " + finalMessage;
    }
    
    if (this.requiresSMS) {
      console.log(`Enviando SMS: ${finalMessage}`);
    }
    
    if (this.requiresEmail) {
      console.log(`Enviando Email: ${finalMessage}`);
    }
  }
}

// Uso
const notification = new BankNotification("Transferencia realizada");
notification.send();
```

#### Problemas con el Código Actual
1. Baja flexibilidad para agregar nuevos tipos de notificación
2. Viola el principio Open/Closed
3. Difícil de mantener y extender
4. No permite combinar comportamientos dinámicamente

#### Implementación con el Patrón Decorator

```typescript
// Interfaz base
interface INotification {
  send(): void;
}

// Componente base
class BasicNotification implements INotification {
  constructor(private message: string) {}

  send(): void {
    console.log(`Notificación básica: ${this.message}`);
  }
}

// Decorador base abstracto
abstract class NotificationDecorator implements INotification {
  constructor(protected notification: INotification) {}

  send(): void {
    this.notification.send();
  }
}

// Decoradores concretos
class UrgentDecorator extends NotificationDecorator {
  send(): void {
    console.log("Agregando marca de urgente");
    this.notification.send();
  }
}

class SMSDecorator extends NotificationDecorator {
  send(): void {
    console.log("Enviando por SMS");
    this.notification.send();
  }
}

class EmailDecorator extends NotificationDecorator {
  send(): void {
    console.log("Enviando por Email");
    this.notification.send();
  }
}

// Ejemplo de uso
const basicNotification = new BasicNotification("Transferencia realizada");
const withSMS = new SMSDecorator(basicNotification);
const withEmail = new EmailDecorator(withSMS);
const urgentWithAll = new UrgentDecorator(withEmail);

urgentWithAll.send();
```

#### Beneficios de la Implementación
1. Flexibilidad para agregar/remover comportamientos en runtime
2. Respeta el principio Open/Closed
3. Permite combinar funcionalidades de manera modular
4. Facilita el mantenimiento y la extensión

## EVALUACIÓN CRÍTICA

### Beneficios
- **Flexibilidad**: Permite agregar/remover comportamientos en tiempo de ejecución
- **Extensibilidad**: Facilita la adición de nuevas funcionalidades sin modificar código existente
- **Composición**: Permite combinar múltiples comportamientos de manera flexible
- **Responsabilidad única**: Cada decorador maneja una única responsabilidad

### Limitaciones
- **Complejidad**: Puede resultar en muchas clases pequeñas
- **Orden de decoradores**: El orden de aplicación puede afectar el resultado
- **Identidad de objetos**: Los decoradores no son idénticos al objeto original
- **Overhead**: Puede introducir una pequeña sobrecarga de rendimiento

### Comparación con Alternativas

#### vs Herencia
- **Decorator**: Más flexible, permite cambios en runtime
- **Herencia**: Más simple, pero estática y puede llevar a explosión de clases

#### vs Strategy
- **Decorator**: Agrega comportamientos, mantiene la interfaz
- **Strategy**: Cambia completamente el algoritmo

### Recomendaciones de Mitigación
1. **Documentación clara**: Mantener documentación sobre el orden de decoradores
2. **Factory Methods**: Usar factories para simplificar la creación de objetos decorados
3. **Interfaces consistentes**: Mantener interfaces simples y coherentes
4. **Testing**: Implementar pruebas exhaustivas para diferentes combinaciones de decoradores