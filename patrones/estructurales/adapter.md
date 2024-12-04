# Patrón de Diseño Adapter en TypeScript

## Contexto y Fundamentos

### Descripción
El patrón Adapter es un patrón estructural que permite que interfaces incompatibles trabajen juntas. Actúa como un puente entre dos interfaces incompatibles, convirtiendo la interfaz de una clase en otra interfaz que los clientes esperan.

### Propósito Fundamental
- Permitir que clases con interfaces incompatibles trabajen juntas
- Reutilizar clases existentes que no tienen la interfaz requerida
- Mantener el principio de Open/Closed al integrar nuevas funcionalidades
- Desacoplar el código cliente de las implementaciones concretas

### Problema que Resuelve
El patrón Adapter aborda varios desafíos técnicos comunes:
- Integración de sistemas legacy con nuevas implementaciones
- Incompatibilidad entre bibliotecas de terceros y código existente
- Necesidad de mantener múltiples versiones de APIs
- Evolución de interfaces sin romper código cliente existente

### Solución Propuesta
La estructura del patrón consta de cuatro componentes principales:
1. **Target**: La interfaz que el cliente espera usar
2. **Adaptee**: La clase existente con interfaz incompatible
3. **Adapter**: La clase que conecta Target con Adaptee
4. **Client**: El código que interactúa con Target


## Comprensión y Aplicabilidad

### Analogía Práctica
Imagina un viajero estadounidense con un dispositivo electrónico que usa un enchufe de 110V intentando conectarlo en España, donde los enchufes son de 220V. El adaptador de corriente actúa como un "Adapter":
- El dispositivo (Client) espera 110V
- El enchufe español (Adaptee) proporciona 220V
- El adaptador de corriente (Adapter) convierte 220V a 110V
- La toma de corriente esperada (Target) es la interfaz que el dispositivo necesita

### Escenarios de Uso Ideal
1. Integración de APIs externas
2. Modernización de sistemas legacy
3. Compatibilidad entre diferentes formatos de datos
4. Mantenimiento de múltiples versiones de una interfaz

### Criterios de Uso

#### Cuándo Usar
- Cuando necesites reutilizar una clase existente que no coincida con la interfaz que necesitas
- Al trabajar con múltiples clases heredadas que necesitan funcionalidad similar
- Para hacer que clases con interfaces incompatibles trabajen juntas
- Cuando quieras crear una clase reutilizable que coopere con clases que no tienen interfaces compatibles

#### Cuándo Evitar
- Cuando puedas modificar directamente la clase original
- Si la adaptación requiere cambios significativos en la lógica de negocio
- Cuando la complejidad añadida no justifica los beneficios
- Si existe una solución más simple (como herencia directa)

## Implementación y Ejemplos

### Ejemplo Práctico: Sistema Bancario

#### Descripción del Escenario
Tenemos un sistema bancario legacy que procesa pagos locales, y necesitamos integrarlo con un nuevo sistema de pagos internacionales.

#### Código Original (Sin Patrón)

```typescript
// Sistema Legacy de Pagos Locales
interface PagoLocal {
    procesarPago(monto: number, cuenta: string): boolean;
    verificarFondos(cuenta: string): number;
}

class SistemaPagosLocal implements PagoLocal {
    procesarPago(monto: number, cuenta: string): boolean {
        console.log(`Procesando pago local de ${monto} para cuenta ${cuenta}`);
        return true;
    }

    verificarFondos(cuenta: string): number {
        return 1000; // Simulación de saldo
    }
}

// Nuevo Sistema de Pagos Internacionales
interface PagoInternacional {
    processInternationalPayment(amount: number, accountId: string, currency: string): Promise<boolean>;
    checkAccountBalance(accountId: string, currency: string): Promise<number>;
}

class SistemaPagosInternacional implements PagoInternacional {
    async processInternationalPayment(amount: number, accountId: string, currency: string): Promise<boolean> {
        console.log(`Processing international payment of ${amount} ${currency} for account ${accountId}`);
        return true;
    }

    async checkAccountBalance(accountId: string, currency: string): Promise<number> {
        return 1000;
    }
}

// Código cliente actual
class Cliente {
    private sistemaPagos: PagoLocal;

    constructor(sistemaPagos: PagoLocal) {
        this.sistemaPagos = sistemaPagos;
    }

    realizarPago(monto: number, cuenta: string): boolean {
        return this.sistemaPagos.procesarPago(monto, cuenta);
    }
}
```

#### Problemas del Código Actual
1. Incompatibilidad de interfaces (síncrona vs asíncrona)
2. Diferentes nombres de métodos y parámetros
3. No hay manejo de conversión de moneda
4. El código cliente está acoplado a la interfaz local

#### Solución con el Patrón Adapter

```typescript
// Adapter para Sistema de Pagos Internacional
class AdapterPagosInternacional implements PagoLocal {
    private sistemaPagosInternacional: PagoInternacional;
    private tasaCambio: number = 1.2; // Ejemplo de tasa de cambio USD/EUR

    constructor(sistemaPagosInternacional: PagoInternacional) {
        this.sistemaPagosInternacional = sistemaPagosInternacional;
    }

    procesarPago(monto: number, cuenta: string): boolean {
        // Convertimos el pago local a internacional
        const montoInternacional = monto * this.tasaCambio;
        
        // Utilizamos async/await en una promesa
        this.sistemaPagosInternacional.processInternationalPayment(
            montoInternacional,
            cuenta,
            'USD'
        ).then(resultado => {
            return resultado;
        }).catch(error => {
            console.error('Error en pago internacional:', error);
            return false;
        });

        return true; // Manejo simplificado para el ejemplo
    }

    verificarFondos(cuenta: string): number {
        let saldo = 0;
        
        // Convertimos la llamada asíncrona a síncrona
        this.sistemaPagosInternacional.checkAccountBalance(cuenta, 'USD')
            .then(balance => {
                saldo = balance / this.tasaCambio;
            })
            .catch(error => {
                console.error('Error al verificar fondos:', error);
            });

        return saldo;
    }
}

// Uso del Adapter
const sistemaPagosInternacional = new SistemaPagosInternacional();
const adaptador = new AdapterPagosInternacional(sistemaPagosInternacional);
const cliente = new Cliente(adaptador);

// El cliente puede usar el sistema internacional como si fuera local
cliente.realizarPago(100, "123456"); // Funciona con ambos sistemas
```

#### Beneficios Obtenidos
1. Transparencia para el código cliente
2. Manejo automático de conversión de moneda
3. Adaptación de interfaces asíncronas a síncronas
4. Reutilización del código existente

## Evaluación Crítica

### Beneficios
1. **Reutilización de Código**
   - Permite usar clases existentes sin modificarlas
   - Reduce la duplicación de código
   - Facilita la integración de sistemas

2. **Flexibilidad**
   - Facilita cambios en implementaciones
   - Permite múltiples adaptadores
   - Soporta evolución gradual

3. **Mantenibilidad**
   - Separa la lógica de adaptación
   - Mejora la organización del código
   - Facilita pruebas unitarias

### Limitaciones
1. **Complejidad**
   - Añade capas adicionales
   - Puede dificultar el debugging
   - Incrementa el número de clases

2. **Rendimiento**
   - Overhead por indirección
   - Posible impacto en sistemas críticos
   - Complejidad en manejo de excepciones

### Comparación con Alternativas
1. **vs Facade**
   - Facade simplifica interfaces
   - Adapter hace compatibles interfaces
   - Facade es más apropiado para simplificación

2. **vs Bridge**
   - Bridge separa abstracción de implementación
   - Adapter hace trabajar interfaces existentes
   - Bridge se diseña desde el inicio

### Recomendaciones
1. **Mitigación de Desventajas**
   - Documentar claramente el propósito de cada adapter
   - Mantener la lógica de adaptación simple
   - Usar inyección de dependencias
   - Implementar logging detallado
   - Considerar el uso de factory methods

2. **Mejores Prácticas**
   - Crear interfaces claras y cohesivas
   - Mantener la responsabilidad única
   - Implementar manejo de errores robusto
   - Usar tipos genéricos cuando sea posible
   - Documentar las transformaciones realizadas