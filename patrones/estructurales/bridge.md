# Patrón de Diseño Bridge: Documentación Técnica

## CONTEXTO Y FUNDAMENTOS

### Descripción del Patrón
El patrón Bridge es un patrón estructural que desacopla una abstracción de su implementación, permitiendo que ambas varíen independientemente. Actúa como un puente entre dos jerarquías de clases, separando la interfaz de alto nivel de sus implementaciones concretas.

### Propósito Fundamental
- Separar la interfaz de un objeto de su implementación
- Permitir que tanto la abstracción como la implementación evolucionen independientemente
- Evitar una explosión de clases cuando un sistema necesita manejar múltiples variantes de una funcionalidad

### Problema que Resuelve
En sistemas complejos, frecuentemente nos encontramos con situaciones donde una clase puede tener múltiples variantes de implementación. Por ejemplo, una clase `PaymentProcessor` podría necesitar manejar diferentes tipos de pagos (tarjeta, efectivo, cripto) en diferentes plataformas (web, móvil, ATM). Sin el patrón Bridge, esto llevaría a una explosión combinatoria de clases.

### Solución Propuesta
El patrón Bridge propone:
1. Separar la abstracción (interfaz de alto nivel) en su propia jerarquía
2. Separar la implementación en otra jerarquía independiente
3. Conectar ambas jerarquías mediante composición, no herencia

## COMPRENSIÓN Y APLICABILIDAD

### Analogía Práctica
Imagina un control remoto universal (abstracción) que puede controlar diferentes dispositivos (implementaciones) como TV, DVD, o equipo de sonido. El control remoto define la interfaz de usuario (botones), mientras que cada dispositivo implementa las operaciones de manera diferente. El "puente" es el protocolo de comunicación entre el control y los dispositivos.

### Escenarios de Uso
- Sistemas de pago con múltiples proveedores y plataformas
- Interfaces gráficas multiplataforma
- Drivers de dispositivos
- Sistemas de notificación multicanal

### Criterios de Uso

#### Cuándo Usar
- Cuando necesitas evitar un vínculo permanente entre abstracción e implementación
- Cuando tanto la abstracción como la implementación deben ser extensibles mediante subclases
- Cuando cambios en la implementación no deben afectar al código cliente

#### Cuándo Evitar
- En sistemas simples donde la flexibilidad adicional no justifica la complejidad
- Cuando solo hay una implementación y no se prevén más
- Cuando la abstracción y la implementación están fuertemente acopladas por diseño

## IMPLEMENTACIÓN Y EJEMPLOS

### Ejemplo Práctico: Sistema de Notificaciones Bancarias

#### Descripción del Ejemplo
Implementaremos un sistema de notificaciones bancarias que debe manejar diferentes tipos de mensajes (saldo, transferencia, alerta) a través de diferentes canales (email, SMS, push).

#### Código Sin Patrón Bridge

```typescript
// Implementación sin patrón Bridge
class NotificacionBancaria {
    private tipo: string;
    private canal: string;

    constructor(tipo: string, canal: string) {
        this.tipo = tipo;
        this.canal = canal;
    }

    enviar(mensaje: string): void {
        if (this.canal === 'email') {
            if (this.tipo === 'saldo') {
                console.log(`Enviando saldo por email: ${mensaje}`);
                // Lógica específica para saldo por email
            } else if (this.tipo === 'transferencia') {
                console.log(`Enviando transferencia por email: ${mensaje}`);
                // Lógica específica para transferencia por email
            }
        } else if (this.canal === 'sms') {
            if (this.tipo === 'saldo') {
                console.log(`Enviando saldo por SMS: ${mensaje}`);
                // Lógica específica para saldo por SMS
            } else if (this.tipo === 'transferencia') {
                console.log(`Enviando transferencia por SMS: ${mensaje}`);
                // Lógica específica para transferencia por SMS
            }
        }
    }
}
```

#### Problemas del Código Actual
1. Alta complejidad ciclomática debido a los condicionales anidados
2. Violación del principio Open/Closed: agregar un nuevo canal o tipo requiere modificar la clase
3. Duplicación de código entre diferentes implementaciones
4. Difícil mantenimiento y testing
5. Baja cohesión: la clase maneja demasiadas responsabilidades

#### Implementación con Patrón Bridge

```typescript
// Implementación del canal de notificación
interface CanalNotificacion {
    enviar(mensaje: string): void;
}

// Implementaciones concretas de canales
class CanalEmail implements CanalNotificacion {
    enviar(mensaje: string): void {
        console.log(`Enviando por email: ${mensaje}`);
    }
}

class CanalSMS implements CanalNotificacion {
    enviar(mensaje: string): void {
        console.log(`Enviando por SMS: ${mensaje}`);
    }
}

// Abstracción de notificación
abstract class Notificacion {
    protected canal: CanalNotificacion;

    constructor(canal: CanalNotificacion) {
        this.canal = canal;
    }

    abstract enviar(): void;
}

// Implementaciones concretas de tipos de notificación
class NotificacionSaldo extends Notificacion {
    private saldo: number;

    constructor(canal: CanalNotificacion, saldo: number) {
        super(canal);
        this.saldo = saldo;
    }

    enviar(): void {
        const mensaje = `Su saldo actual es: $${this.saldo}`;
        this.canal.enviar(mensaje);
    }
}

class NotificacionTransferencia extends Notificacion {
    private monto: number;
    private destinatario: string;

    constructor(canal: CanalNotificacion, monto: number, destinatario: string) {
        super(canal);
        this.monto = monto;
        this.destinatario = destinatario;
    }

    enviar(): void {
        const mensaje = `Transferencia de $${this.monto} a ${this.destinatario} realizada`;
        this.canal.enviar(mensaje);
    }
}

// Ejemplo de uso
const emailChannel = new CanalEmail();
const smsChannel = new CanalSMS();

const saldoEmail = new NotificacionSaldo(emailChannel, 1000);
const transferenciaEmail = new NotificacionTransferencia(emailChannel, 500, "Juan");
const saldoSMS = new NotificacionSaldo(smsChannel, 1000);

saldoEmail.enviar();         // Enviando por email: Su saldo actual es: $1000
transferenciaEmail.enviar(); // Enviando por email: Transferencia de $500 a Juan realizada
saldoSMS.enviar();          // Enviando por SMS: Su saldo actual es: $1000
```

#### Explicación de los Cambios
1. Separación de Responsabilidades:
   - `CanalNotificacion`: Define la interfaz para enviar mensajes
   - `Notificacion`: Abstracción que maneja la lógica de negocio
   - Implementaciones específicas para cada tipo y canal

2. Beneficios Obtenidos:
   - Fácil adición de nuevos canales y tipos de notificación
   - Mayor cohesión y menor acoplamiento
   - Código más limpio y mantenible
   - Mejor testabilidad
   - Reutilización de código

## EVALUACIÓN CRÍTICA

### Beneficios
1. **Flexibilidad**: Permite cambiar implementaciones en tiempo de ejecución
2. **Extensibilidad**: Facilita la adición de nuevas abstracciones e implementaciones
3. **Encapsulamiento**: Oculta detalles de implementación del cliente
4. **Mantenibilidad**: Código más organizado y fácil de mantener

### Limitaciones
1. **Complejidad**: Aumenta la complejidad inicial del código
2. **Overhead**: Puede introducir más clases y objetos
3. **Curva de aprendizaje**: Requiere comprensión clara del patrón

### Comparación con Alternativas
- **Strategy**: Se centra en intercambiar algoritmos, mientras que Bridge separa abstracción de implementación
- **Adapter**: Hace que interfaces incompatibles trabajen juntas, Bridge se usa desde el diseño inicial
- **Abstract Factory**: Crea familias de objetos, Bridge se centra en la separación de concerns

### Recomendaciones
1. **Documentación**: Mantener documentación clara sobre la estructura y propósito
2. **Interfaces claras**: Definir interfaces cohesivas y bien documentadas
3. **Testing**: Implementar pruebas unitarias para cada abstracción e implementación
4. **Refactoring gradual**: Si se aplica a código existente, hacerlo por etapas
5. **Evaluación de necesidad**: Asegurar que la complejidad adicional está justificada 