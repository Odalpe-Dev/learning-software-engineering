# Patrón Builder en TypeScript: Documentación Técnica

## CONTEXTO Y FUNDAMENTOS

### Descripción del Patrón
El patrón Builder es un patrón de diseño creacional que permite construir objetos complejos paso a paso, separando el proceso de construcción de la representación final del objeto. Este patrón encapsula la lógica de construcción en un objeto independiente (Builder), permitiendo crear diferentes representaciones del mismo objeto utilizando el mismo proceso de construcción.

### Propósito Fundamental
El propósito principal es resolver el problema de la construcción de objetos complejos que requieren múltiples pasos o configuraciones, especialmente cuando:
- Un objeto necesita ser construido con numerosos parámetros opcionales
- El orden de construcción es importante
- Se requieren diferentes representaciones del mismo objeto
- Se busca inmutabilidad en el objeto final

### Problema Específico
El patrón Builder aborda varios desafíos técnicos:

1. **Constructores Telescópicos**: Evita la proliferación de constructores con múltiples parámetros opcionales
2. **Construcción Parcial**: Maneja la creación de objetos que pueden estar incompletos durante su construcción
3. **Validación**: Permite validar el estado del objeto durante su construcción
4. **Inmutabilidad**: Facilita la creación de objetos inmutables con múltiples configuraciones

### Solución Propuesta
La estructura del patrón Builder consta de cuatro componentes principales:

1. **Product**: El objeto complejo que se está construyendo
2. **Builder**: Interface abstracta que define los pasos de construcción
3. **ConcreteBuilder**: Implementación específica del Builder
4. **Director**: (Opcional) Clase que define el orden de los pasos de construcción

## COMPRENSIÓN Y APLICABILIDAD

### Analogía Práctica
Imaginemos un restaurante de hamburguesas personalizadas:
- El cliente (Cliente) solicita una hamburguesa
- El chef (Director) conoce las recetas
- El cocinero (ConcreteBuilder) prepara la hamburguesa paso a paso
- La hamburguesa final (Product) es el resultado del proceso

### Escenarios Ideales
El patrón Builder es especialmente útil en:
1. Construcción de objetos de configuración
2. Parseo de documentos complejos (XML, JSON)
3. Creación de objetos inmutables con múltiples parámetros
4. Generación de reportes en diferentes formatos

### Criterios de Uso

**Cuándo Usar**:
- Objetos con más de 3-4 parámetros opcionales
- Necesidad de construcción paso a paso
- Diferentes representaciones del mismo objeto
- Validación durante la construcción

**Cuándo Evitar**:
- Objetos simples con pocos parámetros
- Cuando no hay variación en el proceso de construcción
- Cuando la flexibilidad adicional no justifica la complejidad

## IMPLEMENTACIÓN Y EJEMPLOS

### Ejemplo Básico: Constructor de Consultas SQL

En este ejemplo, vamos a construir consultas SQL utilizando el patrón Builder. Primero, veremos cómo se vería sin el patrón Builder y luego implementaremos la solución con el patrón Builder para mejorar la flexibilidad y legibilidad del código.

#### Sin Builder - Problema

```typescript
class SQLQuery {
  constructor(
    private select: string[] = ['*'],
    private from: string = '',
    private where: string = '',
    private orderBy: string = '',
    private limit: number | null = null
  ) {}

  toString(): string {
    let query = `SELECT ${this.select.join(', ')} FROM ${this.from}`;
    if (this.where) query += ` WHERE ${this.where}`;
    if (this.orderBy) query += ` ORDER BY ${this.orderBy}`;
    if (this.limit) query += ` LIMIT ${this.limit}`;
    return query;
  }
}

// Uso problemático
const query = new SQLQuery(['name', 'email'], 'users', 'age > 18', 'name ASC', 10);
```

#### Con Builder - Solución

```typescript
// Product
class SQLQuery {
  constructor(
    public select: string[],
    public from: string,
    public where: string,
    public orderBy: string,
    public limit: number | null
  ) {}

  toString(): string {
    let query = `SELECT ${this.select.join(', ')} FROM ${this.from}`;
    if (this.where) query += ` WHERE ${this.where}`;
    if (this.orderBy) query += ` ORDER BY ${this.orderBy}`;
    if (this.limit) query += ` LIMIT ${this.limit}`;
    return query;
  }
}

// Builder
class SQLQueryBuilder {
  private select: string[] = ['*'];
  private from: string = '';
  private where: string = '';
  private orderBy: string = '';
  private limit: number | null = null;

  // Métodos de construcción
  selectFields(fields: string[]): SQLQueryBuilder {
    this.select = fields;
    return this;
  }

  fromTable(table: string): SQLQueryBuilder {
    this.from = table;
    return this;
  }

  whereClause(condition: string): SQLQueryBuilder {
    this.where = condition;
    return this;
  }

  orderByClause(orderBy: string): SQLQueryBuilder {
    this.orderBy = orderBy;
    return this;
  }

  limitResults(limit: number): SQLQueryBuilder {
    this.limit = limit;
    return this;
  }

  // Método de construcción final
  build(): SQLQuery {
    if (!this.from) {
      throw new Error('FROM clause is required');
    }
    return new SQLQuery(
      this.select,
      this.from,
      this.where,
      this.orderBy,
      this.limit
    );
  }
}

// Uso del Builder
const query = new SQLQueryBuilder()
  .selectFields(['name', 'email'])
  .fromTable('users')
  .whereClause('age > 18')
  .orderByClause('name ASC')
  .limitResults(10)
  .build();
```

### Cambios y Beneficios

#### Cambios Realizados

1. **Encapsulación de la Lógica de Construcción**: La lógica de construcción de la consulta SQL se ha movido a la clase `SQLQueryBuilder`.
2. **Métodos Fluentes**: Se han añadido métodos fluentes (`selectFields`, `fromTable`, `whereClause`, `orderByClause`, `limitResults`) para configurar los diferentes componentes de la consulta.
3. **Validación**: Se ha añadido una validación para asegurar que la cláusula `FROM` esté presente antes de construir la consulta.

#### Beneficios Obtenidos

1. **Legibilidad Mejorada**: El uso de métodos fluentes hace que el código sea más legible y fácil de entender.
2. **Flexibilidad**: Permite construir consultas SQL de manera flexible y paso a paso.
3. **Reutilización**: La lógica de construcción se puede reutilizar para diferentes consultas sin duplicar código.
4. **Mantenimiento**: Facilita el mantenimiento y la extensión del código al encapsular la lógica de construcción en una clase separada.

## EVALUACIÓN CRÍTICA

### Beneficios

1. **Encapsulación**: Aísla el código de construcción complejo
2. **Flexibilidad**: Permite diferentes representaciones del mismo objeto
3. **Control**: Proporciona control fino sobre el proceso de construcción
4. **Legibilidad**: Mejora la legibilidad del código con una API fluida
5. **Validación**: Facilita la validación durante la construcción

### Limitaciones

1. **Complejidad**: Aumenta la complejidad del código con clases adicionales
2. **Overhead**: Puede introducir overhead innecesario para objetos simples
3. **Duplicación**: Puede requerir duplicación de código entre diferentes builders
4. **Mantenimiento**: Requiere mantener múltiples clases sincronizadas

### Comparación con Alternativas

1. **Factory Method**:
   - Más simple, pero menos flexible
   - Mejor para objetos con pocas variaciones

2. **Abstract Factory**:
   - Enfocado en familias de objetos
   - Menos control sobre el proceso de construcción

3. **Prototype**:
   - Mejor para clonación de objetos
   - No proporciona construcción paso a paso

### Recomendaciones

1. **Mitigación de Complejidad**:
   - Usar interfaces fluidas para mejorar la legibilidad
   - Implementar validación temprana
   - Documentar claramente el propósito de cada builder

2. **Optimización**:
   - Considerar el uso de builders genéricos
   - Implementar caché para builders frecuentemente utilizados
   - Utilizar el patrón Singleton para builders stateless

3. **Mantenimiento**:
   - Mantener una clara separación de responsabilidades
   - Implementar pruebas unitarias exhaustivas
   - Documentar las dependencias entre componentes