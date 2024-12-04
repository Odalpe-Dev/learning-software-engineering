# Patrón de Diseño Flyweight

## CONTEXTO Y FUNDAMENTOS

### Descripción del Patrón
El patrón Flyweight es un patrón de diseño estructural que permite reducir el uso de memoria compartiendo estados comunes entre múltiples objetos. En lugar de mantener toda esta información en cada objeto, los datos compartidos se mantienen en objetos Flyweight separados que pueden ser utilizados por múltiples objetos de contexto.

### Propósito Fundamental
- Optimizar el uso de memoria cuando una aplicación necesita crear un gran número de objetos similares
- Separar los estados intrínsecos (compartidos) de los estados extrínsecos (únicos)
- Mantener la integridad de los datos mientras se reduce la redundancia

### Problema que Resuelve
En aplicaciones que requieren crear miles o millones de objetos similares, cada instancia consume memoria, incluso cuando gran parte de su estado podría compartirse. Esto puede llevar a:
- Consumo excesivo de memoria RAM
- Degradación del rendimiento debido a la gestión de memoria
- Tiempos de respuesta lentos en operaciones que involucran múltiples objetos

### Solución Propuesta
La solución se estructura en varios componentes clave:
1. **Flyweight**: Define la interfaz para objetos que pueden compartir estado
2. **ConcreteFlyweight**: Implementa la interfaz Flyweight y almacena el estado intrínseco
3. **FlyweightFactory**: Crea y gestiona objetos Flyweight
4. **Context**: Contiene el estado extrínseco único para cada objeto

## COMPRENSIÓN Y APLICABILIDAD

### Analogía Práctica
Imaginemos una biblioteca con múltiples copias del mismo libro:
- **Estado Intrínseco** (Flyweight): Contenido del libro, autor, editorial (igual para todas las copias)
- **Estado Extrínseco**: Número de inventario, estado de préstamo, ubicación en estantería (único para cada copia)

### Escenarios Ideales
- Sistemas con gran cantidad de objetos similares
- Aplicaciones con restricciones de memoria
- Cuando la mayoría del estado del objeto puede ser categorizado como extrínseco
- Sistemas que necesitan cache de datos compartidos

### Criterios de Uso

#### Cuándo Usar
- Cuando la aplicación necesita soportar un gran número de objetos que comparten propiedades comunes
- Cuando la memoria es una limitación crítica
- Cuando las propiedades compartidas son inmutables

#### Cuándo Evitar
- Si hay pocos objetos similares
- Si la complejidad de implementación supera los beneficios de optimización
- Si el estado compartido cambia frecuentemente

## IMPLEMENTACIÓN Y EJEMPLOS

### Ejemplo Práctico: Sistema Bancario

#### Descripción
Implementaremos un sistema para manejar transacciones bancarias donde miles de transacciones comparten propiedades comunes como tipos de operación y categorías.

#### Código Original (Sin Patrón)

```typescript
// Código sin aplicar el patrón
class Transaction {
    constructor(
        public id: string,
        public amount: number,
        public date: Date,
        public type: string,
        public category: string,
        public description: string,
        public currency: string,
        public exchangeRate: number,
        public fees: number,
        public metadata: {
            categoryIcon: string,
            categoryColor: string,
            categoryDescription: string,
            typeIcon: string,
            typeColor: string,
            typeDescription: string
        }
    ) {}
}

// Uso
const transactions: Transaction[] = [];
for (let i = 0; i < 10000; i++) {
    transactions.push(new Transaction(
        `TX${i}`,
        100,
        new Date(),
        'PAYMENT',
        'UTILITIES',
        'Monthly payment',
        'USD',
        1.0,
        0.5,
        {
            categoryIcon: '💡',
            categoryColor: '#FFB6C1',
            categoryDescription: 'Payments for utility services',
            typeIcon: '💳',
            typeColor: '#90EE90',
            typeDescription: 'Regular payment transaction'
        }
    ));
}
```

#### Problemas del Código Actual
1. Cada transacción duplica información común (metadata de categoría y tipo)
2. Alto consumo de memoria por datos redundantes
3. Dificultad para mantener consistencia en datos compartidos
4. Impacto en rendimiento al manejar grandes volúmenes de datos

#### Implementación con Flyweight

```typescript
// Estado intrínseco compartido
interface TransactionMetadata {
    icon: string;
    color: string;
    description: string;
}

// Flyweight
class TransactionType {
    constructor(
        public type: string,
        public metadata: TransactionMetadata
    ) {}
}

class TransactionCategory {
    constructor(
        public category: string,
        public metadata: TransactionMetadata
    ) {}
}

// Flyweight Factory
class TransactionMetadataFactory {
    private types: Map<string, TransactionType> = new Map();
    private categories: Map<string, TransactionCategory> = new Map();

    getTransactionType(type: string): TransactionType {
        if (!this.types.has(type)) {
            this.types.set(type, new TransactionType(type, {
                icon: this.getTypeIcon(type),
                color: this.getTypeColor(type),
                description: this.getTypeDescription(type)
            }));
        }
        return this.types.get(type)!;
    }

    getTransactionCategory(category: string): TransactionCategory {
        if (!this.categories.has(category)) {
            this.categories.set(category, new TransactionCategory(category, {
                icon: this.getCategoryIcon(category),
                color: this.getCategoryColor(category),
                description: this.getCategoryDescription(category)
            }));
        }
        return this.categories.get(category)!;
    }

    private getTypeIcon(type: string): string {
        // Lógica para obtener ícono según tipo
        return '💳';
    }

    private getTypeColor(type: string): string {
        return '#90EE90';
    }

    private getTypeDescription(type: string): string {
        return 'Regular payment transaction';
    }

    private getCategoryIcon(category: string): string {
        return '💡';
    }

    private getCategoryColor(category: string): string {
        return '#FFB6C1';
    }

    private getCategoryDescription(category: string): string {
        return 'Payments for utility services';
    }
}

// Contexto con estado extrínseco
class OptimizedTransaction {
    constructor(
        public id: string,
        public amount: number,
        public date: Date,
        public typeRef: TransactionType,
        public categoryRef: TransactionCategory,
        public description: string,
        public currency: string,
        public exchangeRate: number,
        public fees: number
    ) {}
}

// Uso del patrón
const factory = new TransactionMetadataFactory();
const optimizedTransactions: OptimizedTransaction[] = [];

for (let i = 0; i < 10000; i++) {
    optimizedTransactions.push(new OptimizedTransaction(
        `TX${i}`,
        100,
        new Date(),
        factory.getTransactionType('PAYMENT'),
        factory.getTransactionCategory('UTILITIES'),
        'Monthly payment',
        'USD',
        1.0,
        0.5
    ));
}
```

#### Beneficios Obtenidos
1. Reducción significativa del uso de memoria
2. Mejor mantenibilidad de datos compartidos
3. Mayor consistencia en la información
4. Mejor rendimiento en operaciones masivas

## EVALUACIÓN CRÍTICA

### Beneficios Tangibles
1. **Optimización de Memoria**: Reducción significativa del uso de RAM
2. **Consistencia**: Garantiza que los datos compartidos sean idénticos
3. **Mantenibilidad**: Cambios en datos compartidos se aplican globalmente
4. **Rendimiento**: Mejor respuesta en operaciones con grandes volúmenes de datos

### Limitaciones y Desventajas
1. **Complejidad**: Aumenta la complejidad del código
2. **Debugging**: Puede ser más difícil depurar problemas
3. **Sincronización**: Requiere consideraciones especiales en ambientes multi-hilo
4. **Overhead inicial**: Configuración inicial más compleja

### Comparación con Alternativas
- **Singleton**: Más simple pero no optimiza memoria
- **Prototype**: Mejor para clonación de objetos pero no comparte estado
- **Cache**: Solución más simple pero menos eficiente en memoria

### Recomendaciones de Mitigación
1. Documentar claramente la estructura y responsabilidades
2. Implementar logging detallado para facilitar debugging
3. Usar TypeScript strict mode para detectar errores temprano
4. Considerar implementar pruebas unitarias específicas
5. Mantener una clara separación entre estados intrínsecos y extrínsecos