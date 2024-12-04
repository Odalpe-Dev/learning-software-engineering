# Patrón de Diseño Command

## CONTEXTO Y FUNDAMENTOS

### Descripción
El patrón Command es un patrón de comportamiento que encapsula una solicitud como un objeto, permitiendo parametrizar clientes con diferentes solicitudes, encolar o registrar solicitudes, y soportar operaciones reversibles.

### Propósito y Casos de Uso
- Abstraer operaciones en objetos independientes
- Implementar operaciones deshacer/rehacer
- Encolar y programar ejecución de comandos
- Mantener un historial de operaciones
- Implementar transacciones distribuidas

### Problema
En sistemas complejos, frecuentemente necesitamos:
- Desacoplar el objeto que invoca una operación del objeto que sabe cómo ejecutarla
- Agregar nuevas operaciones sin modificar las clases existentes
- Implementar operaciones reversibles o transaccionales
- Manejar colas de operaciones y su ejecución diferida

### Solución Propuesta
El patrón Command propone:
1. Crear una interfaz Command con método execute()
2. Encapsular la solicitud en objetos Command concretos
3. Parametrizar un objeto Invoker con diferentes comandos
4. Mantener un Receiver que ejecuta la lógica real

## COMPRENSIÓN Y APLICABILIDAD

### Analogía del Mundo Real
Imagina un restaurante:
- Cliente (Client): Comensal que hace el pedido
- Camarero (Invoker): Toma la orden y la pasa a la cocina
- Orden (Command): Ticket con los detalles del pedido
- Cocinero (Receiver): Prepara el plato según la orden

### Escenarios Ideales
- Sistemas con operaciones complejas que requieren configuración
- Aplicaciones que necesitan deshacer/rehacer
- Sistemas de procesamiento por lotes o cola
- UIs con múltiples formas de triggear la misma acción

### Criterios de Uso

✅ Usar cuando:
- Necesitas parametrizar objetos con operaciones
- Requieres operaciones reversibles
- Necesitas encolar operaciones
- Buscas desacoplar quien invoca de quien ejecuta

❌ No usar cuando:
- Las operaciones son simples y directas
- No hay necesidad de deshacer/encolar
- El overhead de crear objetos Command es injustificado

## IMPLEMENTACIÓN Y EJEMPLOS

### Ejemplo Práctico: Editor de Texto

#### Situación Inicial (Sin Patrón)

```typescript
class TextEditor {
    private content: string = '';

    public type(text: string): void {
        this.content += text;
    }

    public delete(length: number): void {
        this.content = this.content.slice(0, -length);
    }

    public getContent(): string {
        return this.content;
    }
}

// Uso
const editor = new TextEditor();
editor.type("Hola ");
editor.type("Mundo");
editor.delete(5);
console.log(editor.getContent()); // Imprime: "Hola "
```

#### Problemas del Código Actual
1. No hay forma de deshacer operaciones
2. No se puede mantener historial de cambios
3. Difícil agregar nuevas operaciones sin modificar TextEditor
4. No se pueden encolar operaciones para ejecución diferida

#### Implementación con Command Pattern

```typescript
// Command Interface
interface Command {
    execute(): void;
    undo(): void;
}

// Receiver
class TextEditor {
    private content: string = '';

    public insertText(text: string): void {
        this.content += text;
    }

    public deleteText(length: number): void {
        this.content = this.content.slice(0, -length);
    }

    public getContent(): string {
        return this.content;
    }
}

// Concrete Commands
class TypeCommand implements Command {
    private backup: string;

    constructor(
        private editor: TextEditor,
        private text: string
    ) {
        this.backup = '';
    }

    execute(): void {
        this.backup = this.editor.getContent();
        this.editor.insertText(this.text);
    }

    undo(): void {
        this.editor.deleteText(this.text.length);
    }
}

class DeleteCommand implements Command {
    private backup: string;

    constructor(
        private editor: TextEditor,
        private length: number
    ) {
        this.backup = '';
    }

    execute(): void {
        this.backup = this.editor.getContent();
        this.editor.deleteText(this.length);
    }

    undo(): void {
        const deletedText = this.backup.slice(-this.length);
        this.editor.insertText(deletedText);
    }
}

// Invoker
class EditorInvoker {
    private history: Command[] = [];
    private undoneCommands: Command[] = [];

    executeCommand(command: Command): void {
        command.execute();
        this.history.push(command);
        this.undoneCommands = []; // Clear redo stack
    }

    undo(): void {
        const command = this.history.pop();
        if (command) {
            command.undo();
            this.undoneCommands.push(command);
        }
    }

    redo(): void {
        const command = this.undoneCommands.pop();
        if (command) {
            command.execute();
            this.history.push(command);
        }
    }
}

// Uso
const editor = new TextEditor();
const invoker = new EditorInvoker();

invoker.executeCommand(new TypeCommand(editor, "Hola "));
invoker.executeCommand(new TypeCommand(editor, "Mundo"));
console.log(editor.getContent()); // "Hola Mundo"

invoker.undo(); // Deshace "Mundo"
console.log(editor.getContent()); // "Hola "

invoker.redo(); // Rehace "Mundo"
console.log(editor.getContent()); // "Hola Mundo"
```

### Explicación de Cambios y Beneficios
1. **Desacoplamiento**: Las operaciones están encapsuladas en comandos independientes
2. **Extensibilidad**: Nuevos comandos pueden agregarse sin modificar el editor
3. **Reversibilidad**: Cada comando sabe cómo deshacerse
4. **Historia**: Se mantiene un registro de operaciones
5. **Flexibilidad**: Fácil implementación de undo/redo

## EVALUACIÓN CRÍTICA

### Beneficios
- Desacoplamiento total entre la invocación y la ejecución
- Fácil implementación de operaciones complejas
- Soporte natural para undo/redo
- Extensibilidad sin modificar código existente
- Posibilidad de composición de comandos

### Limitaciones
- Incremento en la complejidad del código
- Overhead por creación de objetos Command
- Potencial sobrecarga de memoria con historial largo
- Complejidad adicional en la gestión de estado

### Comparación con Alternativas
- **Strategy**: Similar pero enfocado en algoritmos intercambiables
- **Observer**: Maneja notificaciones pero no encapsula operaciones
- **Memento**: Complementario para manejar estados
- **Chain of Responsibility**: Maneja secuencia de operaciones diferente

### Recomendaciones
1. Implementar limpieza periódica del historial
2. Usar Command para operaciones complejas solamente
3. Considerar implementación de Memento para estados grandes
4. Implementar límites en la pila de undo/redo
5. Usar Composite Pattern para comandos compuestos