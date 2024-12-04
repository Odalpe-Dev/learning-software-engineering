# Patrón Strategy: Documentación Técnica Detallada

## CONTEXTO Y FUNDAMENTOS

### Descripción del Patrón
El patrón Strategy es un patrón de diseño comportamental que permite definir una familia de algoritmos, encapsular cada uno de ellos y hacerlos intercambiables. Strategy permite que el algoritmo varíe independientemente de los clientes que lo utilizan.

### Propósito Fundamental
- Encapsular algoritmos relacionados en clases separadas
- Permitir la selección dinámica del algoritmo en tiempo de ejecución
- Facilitar la adición de nuevos algoritmos sin modificar el código existente
- Eliminar condicionales complejos relacionados con la selección de comportamientos

### Problema que Resuelve
El patrón Strategy aborda varios desafíos técnicos comunes:
1. Proliferación de condicionales para seleccionar comportamientos
2. Duplicación de código cuando existen variantes similares de un algoritmo
3. Acoplamiento rígido entre el cliente y el algoritmo específico
4. Dificultad para añadir o modificar comportamientos sin afectar el código existente

### Solución Propuesta
La solución se estructura en tres componentes principales:

1. **Context**: Mantiene una referencia a la estrategia concreta y se comunica con ella
2. **Strategy**: Interface o clase abstracta que define el contrato para todos los algoritmos
3. **Concrete Strategies**: Implementaciones específicas de los algoritmos

## COMPRENSIÓN Y APLICABILIDAD

### Analogía Práctica
Imagina una aplicación de navegación GPS:
- El navegador (Context) necesita calcular la mejor ruta
- Existen diferentes estrategias de cálculo:
  - Ruta más rápida (Strategy A)
  - Ruta más corta (Strategy B)
  - Ruta con menos peajes (Strategy C)
  - Ruta para bicicletas (Strategy D)

El usuario puede cambiar la estrategia en cualquier momento, y el navegador funcionará con cualquiera de ellas sin necesidad de modificar su código.

### Escenarios Ideales
- Sistemas con múltiples variantes de un algoritmo
- Aplicaciones que requieren cambios dinámicos de comportamiento
- Código con condicionales complejos basados en tipos o comportamientos
- Situaciones donde los algoritmos deben ser intercambiables

### Criterios de Uso

**Cuándo Usar:**
- Existe una familia de algoritmos similares
- Se necesita variar el algoritmo en tiempo de ejecución
- Se requiere aislar la lógica del algoritmo del código que lo utiliza
- Hay muchas clases similares que solo difieren en su comportamiento

**Cuándo No Usar:**
- Los algoritmos raramente cambian
- Solo hay una o dos variantes simples del algoritmo
- El costo de la abstracción supera los beneficios
- La aplicación es simple y no requiere flexibilidad adicional

## IMPLEMENTACIÓN Y EJEMPLOS

### Ejemplo Práctico: Sistema de Cálculo de Comisiones Bancarias

#### 1. Descripción del Ejemplo
Sistema que calcula comisiones para diferentes tipos de transacciones bancarias.

#### 2. Código Sin Patrón Strategy

```typescript
class TransactionProcessor {
  calculateFee(amount: number, type: 'withdrawal' | 'transfer' | 'payment'): number {
    if (type === 'withdrawal') {
      // Comisión para retiros
      return amount < 1000 ? 2 : amount * 0.02;
    } else if (type === 'transfer') {
      // Comisión para transferencias
      return amount < 5000 ? 5 : amount * 0.01;
    } else if (type === 'payment') {
      // Comisión para pagos
      return amount < 100 ? 1 : amount * 0.03;
    }
    return 0;
  }
}

// Uso
const processor = new TransactionProcessor();
console.log(processor.calculateFee(2000, 'withdrawal')); // 40
console.log(processor.calculateFee(3000, 'transfer')); // 5
```

#### 3. Problemas del Código Actual
- Violación del principio Open/Closed: añadir nuevo tipo requiere modificar la clase
- Código difícil de mantener con lógica condicional compleja
- Duplicación potencial si se necesita reutilizar lógica de comisiones
- Testing complejo al tener toda la lógica en un solo método
- Dificultad para cambiar el comportamiento en runtime

#### 4. Implementación con Strategy Pattern

```typescript
// Strategy Interface
interface FeeCalculationStrategy {
  calculateFee(amount: number): number;
}

// Concrete Strategies
class WithdrawalFeeStrategy implements FeeCalculationStrategy {
  calculateFee(amount: number): number {
    return amount < 1000 ? 2 : amount * 0.02;
  }
}

class TransferFeeStrategy implements FeeCalculationStrategy {
  calculateFee(amount: number): number {
    return amount < 5000 ? 5 : amount * 0.01;
  }
}

class PaymentFeeStrategy implements FeeCalculationStrategy {
  calculateFee(amount: number): number {
    return amount < 100 ? 1 : amount * 0.03;
  }
}

// Context
class TransactionProcessor {
  private feeStrategy: FeeCalculationStrategy;

  constructor(strategy: FeeCalculationStrategy) {
    this.feeStrategy = strategy;
  }

  setStrategy(strategy: FeeCalculationStrategy) {
    this.feeStrategy = strategy;
  }

  calculateFee(amount: number): number {
    return this.feeStrategy.calculateFee(amount);
  }
}

// Factory para crear estrategias (opcional pero recomendado)
class FeeStrategyFactory {
  static getStrategy(type: 'withdrawal' | 'transfer' | 'payment'): FeeCalculationStrategy {
    switch (type) {
      case 'withdrawal':
        return new WithdrawalFeeStrategy();
      case 'transfer':
        return new TransferFeeStrategy();
      case 'payment':
        return new PaymentFeeStrategy();
      default:
        throw new Error('Invalid transaction type');
    }
  }
}

// Uso
const processor = new TransactionProcessor(FeeStrategyFactory.getStrategy('withdrawal'));
console.log(processor.calculateFee(2000)); // 40

// Cambiar estrategia en runtime
processor.setStrategy(FeeStrategyFactory.getStrategy('transfer'));
console.log(processor.calculateFee(3000)); // 5
```

#### 5. Beneficios Obtenidos
- Cada estrategia está encapsulada en su propia clase
- Fácil agregar nuevas estrategias sin modificar código existente
- Testing simplificado: cada estrategia puede probarse de forma aislada
- Mayor flexibilidad para cambiar comportamientos en runtime
- Código más mantenible y escalable

## EVALUACIÓN CRÍTICA

### Beneficios Tangibles
1. **Flexibilidad**: Facilita cambios de comportamiento en runtime
2. **Mantenibilidad**: Código más organizado y fácil de entender
3. **Extensibilidad**: Nuevos comportamientos sin modificar código existente
4. **Testabilidad**: Facilita el testing unitario de cada estrategia
5. **Reusabilidad**: Las estrategias pueden reutilizarse en diferentes contextos

### Limitaciones y Desventajas
1. **Complejidad**: Aumenta el número de clases en el sistema
2. **Overhead**: Puede ser excesivo para casos simples
3. **Acoplamiento**: Todas las estrategias deben conocer el contexto necesario
4. **Comunicación**: Puede requerir paso de datos adicionales entre contexto y estrategias

### Comparación con Alternativas
1. **vs. Simple Conditionals**
   - Más complejo pero más flexible y mantenible
   - Mejor para casos con múltiples variantes

2. **vs. Template Method**
   - Strategy es más flexible en runtime
   - Template Method es más simple pero menos dinámico

3. **vs. Command Pattern**
   - Strategy se enfoca en algoritmos intercambiables
   - Command se centra en encapsular acciones completas

### Recomendaciones de Mitigación
1. **Para Complejidad**:
   - Usar factory methods para crear estrategias
   - Documentar claramente el propósito de cada estrategia
   - Mantener interfaces simples y cohesivas

2. **Para Overhead**:
   - Evaluar si la flexibilidad justifica la complejidad adicional
   - Considerar alternativas más simples para casos básicos

3. **Para Acoplamiento**:
   - Diseñar interfaces claras y minimalistas
   - Usar inyección de dependencias cuando sea necesario

4. **Para Comunicación**:
   - Crear DTOs específicos para el paso de datos
   - Establecer contratos claros entre contexto y estrategias