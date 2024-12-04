# Patrón Observer: Documentación Técnica

## CONTEXTO Y FUNDAMENTOS

### Descripción del Patrón
El patrón Observer establece una relación uno-a-muchos entre objetos, donde cuando un objeto (el "sujeto" o "subject") cambia su estado, todos sus dependientes (los "observadores" u "observers") son notificados y actualizados automáticamente.

### Propósito Fundamental
El objetivo principal es lograr un acoplamiento flexible entre objetos que interactúan, permitiendo que varíen independientemente. Esto facilita la comunicación entre componentes sin crear dependencias fuertes entre ellos.

### Problema que Resuelve
- **Desafío Principal**: Mantener la consistencia entre objetos relacionados sin crear un acoplamiento fuerte.
- **Desafíos Técnicos**:
  - Notificación a múltiples objetos sobre cambios de estado
  - Adición/eliminación dinámica de observadores
  - Mantenimiento de la consistencia del sistema
  - Evitar ciclos de actualización infinitos


## COMPRENSIÓN Y APLICABILIDAD

### Analogía del Mundo Real
Imagina un sistema de notificaciones de una red social:
- El post (subject) es el objeto observado
- Los seguidores (observers) son notificados cuando hay una actualización
- Los seguidores pueden suscribirse o desuscribirse en cualquier momento
- Cada seguidor puede reaccionar de manera diferente a la misma actualización

### Escenarios de Uso Adecuados
1. Sistemas de eventos y manejo de GUI
2. Monitoreo de cambios en tiempo real
3. Sistemas de logging y auditoría
4. Actualizaciones en tiempo real de dashboards
5. Sistemas de notificaciones

### Criterios de Uso

**Cuándo Usar**:
- Cuando un cambio en un objeto requiere cambios en otros
- Cuando no se conoce el número de objetos que deben ser notificados
- Cuando se necesita bajo acoplamiento entre componentes

**Cuándo No Usar**:
- En sistemas simples donde la complejidad adicional no se justifica
- Cuando las notificaciones son síncronas y pueden causar cuellos de botella
- En sistemas con restricciones de rendimiento críticas

## IMPLEMENTACIÓN Y EJEMPLOS

### Ejemplo Práctico: Sistema de Monitoreo de Precios

#### Escenario
Implementaremos un sistema donde múltiples displays necesitan mostrar actualizaciones de precios de productos en tiempo real.

#### Código Sin el Patrón

```typescript
class PriceDisplay {
    private productName: string;
    private price: number;

    constructor(productName: string, price: number) {
        this.productName = productName;
        this.price = price;
    }

    updatePrice(newPrice: number) {
        this.price = newPrice;
        this.render();
    }

    private render() {
        console.log(`${this.productName}: $${this.price}`);
    }
}

class Store {
    private displays: PriceDisplay[] = [];

    addDisplay(display: PriceDisplay) {
        this.displays.push(display);
    }

    updatePrice(productName: string, newPrice: number) {
        this.displays.forEach(display => {
            display.updatePrice(newPrice);
        });
    }
}
```

#### Problemas del Código Actual
1. Acoplamiento fuerte entre Store y PriceDisplay
2. Dificultad para añadir nuevos tipos de displays
3. Cada display debe ser actualizado manualmente
4. No hay forma de desuscribirse de las actualizaciones
5. Difícil de testear y mantener

#### Implementación con el Patrón Observer

```typescript
// Interfaces base
interface PriceObserver {
    update(productName: string, price: number): void;
}

interface PriceSubject {
    attach(observer: PriceObserver): void;
    detach(observer: PriceObserver): void;
    notify(productName: string, price: number): void;
}

// Implementación del Subject
class Store implements PriceSubject {
    private observers: Set<PriceObserver> = new Set();
    private prices: Map<string, number> = new Map();

    attach(observer: PriceObserver): void {
        this.observers.add(observer);
    }

    detach(observer: PriceObserver): void {
        this.observers.delete(observer);
    }

    notify(productName: string, price: number): void {
        this.observers.forEach(observer => observer.update(productName, price));
    }

    updatePrice(productName: string, newPrice: number): void {
        this.prices.set(productName, newPrice);
        this.notify(productName, newPrice);
    }
}

// Implementaciones de Observers
class ConsoleDisplay implements PriceObserver {
    update(productName: string, price: number): void {
        console.log(`ConsoleDisplay: ${productName} price updated to $${price}`);
    }
}

class MobileAppDisplay implements PriceObserver {
    update(productName: string, price: number): void {
        console.log(`📱 MobileApp: ${productName} - $${price}`);
    }
}

class WebDisplay implements PriceObserver {
    update(productName: string, price: number): void {
        console.log(`🌐 WebDisplay: New price for ${productName}: $${price}`);
    }
}

// Ejemplo de uso
const store = new Store();
const consoleDisplay = new ConsoleDisplay();
const mobileApp = new MobileAppDisplay();
const webDisplay = new WebDisplay();

// Registrar observers
store.attach(consoleDisplay);
store.attach(mobileApp);
store.attach(webDisplay);

// Actualizar precio
store.updatePrice("Laptop", 999.99);

// Desregistrar un observer
store.detach(mobileApp);

// Nueva actualización
store.updatePrice("Laptop", 899.99);
```

### Beneficios de la Implementación
1. **Desacoplamiento**: Los displays no conocen detalles de la tienda
2. **Extensibilidad**: Fácil agregar nuevos tipos de displays
3. **Mantenibilidad**: Cada componente tiene una responsabilidad única
4. **Flexibilidad**: Los observers pueden suscribirse/desuscribirse dinámicamente

## EVALUACIÓN CRÍTICA

### Beneficios
1. Bajo acoplamiento entre componentes
2. Soporte para comunicación broadcast
3. Establecimiento dinámico de relaciones
4. Reutilización y mantenibilidad mejorada

### Limitaciones
1. Orden de actualización no garantizado
2. Potenciales problemas de memoria con muchos observers
3. Actualizaciones en cascada pueden ser costosas
4. Posibles ciclos de actualización

### Comparación con Alternativas
- **Mediator**: Centraliza la comunicación pero puede volverse complejo
- **Publish/Subscribe**: Más desacoplado pero más complejo de implementar
- **Chain of Responsibility**: Mejor para procesamiento secuencial

### Recomendaciones
1. Implementar mecanismo de limpieza de observers
2. Considerar actualizaciones batch para mejor rendimiento
3. Implementar control de ciclos de actualización
4. Usar weak references para prevenir memory leaks
5. Considerar implementar prioridades de actualización si es necesario