# Programación Imperativa

La programación imperativa se centra en describir paso a paso cómo realizar una tarea. En este enfoque, un programa se compone de una serie de instrucciones que modifican el estado del programa a lo largo del tiempo. Es como darle a la computadora una lista detallada de tareas a realizar, una tras otra.

## Principios Fundamentales

- **Secuencia de Instrucciones**: Las instrucciones se ejecutan secuencialmente, una después de la otra. Esto significa que el orden en el que se escriben las instrucciones importa y afecta el resultado final del programa.
- **Estado Mutable**: Los programas imperativos hacen un uso extensivo de variables y estructuras de datos mutables. Estos valores pueden cambiar a lo largo de la ejecución del programa, lo que permite a los desarrolladores realizar seguimiento de cambios y manipular datos según sea necesario.
- **Estructuras de Control**: Los bucles, las estructuras condicionales y las funciones son elementos fundamentales en la programación imperativa. Estas construcciones controlan el flujo de ejecución del programa y permiten tomar decisiones basadas en ciertas condiciones.
- **Procedimientos y Subrutinas**: La programación imperativa se basa en la idea de dividir un programa en procedimientos o subrutinas más pequeñas. Estas unidades de código pueden ser llamadas y reutilizadas en diferentes partes del programa para evitar la repetición y mejorar la modularidad.

## Ventajas y Desventajas

### Ventajas

- **Fácil de Implementar**: La programación imperativa es una forma natural de pensar para muchos desarrolladores, ya que sigue un enfoque paso a paso similar al pensamiento humano.
- **Control Preciso**: Los programas imperativos ofrecen un control preciso sobre el flujo
de ejecución, lo que es ideal para aplicaciones que requieren una secuencia de acciones específica.
- **Optimización**: Debido a su naturaleza secuencial, los programas imperativos pueden ser más fáciles de optimizar y depurar, ya que es más sencillo seguir el flujo de ejecución y detectar errores.

### Desventajas

- **Complejidad**: A medida que los programas crecen, pueden volverse complejos y difíciles de mantener debido a la cantidad de instrucciones y la interacción entre diferentes partes del código.
- **Repetición de Código**: La programación imperativa puede llevar a la repetición de código, ya que las mismas instrucciones pueden ser necesarias en múltiples partes del programa.
- **Dificultad para la Paralelización**: Debido a su naturaleza secuencial, los programas imperativos pueden ser más difíciles de paralelizar y escalar en entornos distribuidos o concurrentes.

## Ejemplo de Programa Imperativa en TypeScript

### Ejemplo Básico: Suma de Números Pares

Vamos a crear un programa que sume todos los números pares de un arreglo de números. Este ejemplo ilustra cómo la programación imperativa se enfoca en describir paso a paso cómo realizar una tarea.

```typescript
function sumEvenNumbers(arr: number[]): number {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] % 2 === 0) {
      sum += arr[i];
    }
  }
  return sum;
}

// Uso del programa
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log(sumEvenNumbers(numbers)); // Output: 30
```

En este ejemplo, el programa sigue una secuencia de instrucciones claras:

1. Inicializa una variable `sum` en 0.
2. Recorre cada elemento del arreglo.
3. Verifica si el número es par.
4. Si es par, lo suma a `sum`.
5. Devuelve la suma total de los números pares.

### Ejemplo Avanzado: Sistema de Gestión de Tareas

Vamos a crear un sistema de gestión de tareas utilizando clases en TypeScript. Este ejemplo muestra cómo la programación imperativa puede ser utilizada para manejar el estado y las operaciones de un sistema de tareas.

```typescript
class Task {
  constructor(public id: number, public name: string, public completed: boolean = false) {}
}

class TaskManager {
  private tasks: Task[] = [];
  private nextId: number = 1;

  addTask(name: string): Task {
    const task = new Task(this.nextId++, name);
    this.tasks.push(task);
    return task;
  }

  completeTask(id: number): boolean {
    const task = this.tasks.find(task => task.id === id);
    if (task) {
      task.completed = true;
      return true;
    }
    return false;
  }

  removeTask(id: number): boolean {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index !== -1) {
      this.tasks.splice(index, 1);
      return true;
    }
    return false;
  }

  listTasks(): Task[] {
    return this.tasks;
  }
}

// Uso del sistema de gestión de tareas
const taskManager = new TaskManager();
taskManager.addTask("Learn TypeScript");
taskManager.addTask("Write Documentation");
taskManager.completeTask(1);
console.log(taskManager.listTasks());
taskManager.removeTask(2);
console.log(taskManager.listTasks());
```

En este ejemplo, el sistema de gestión de tareas sigue una serie de pasos claros para agregar, completar, eliminar y listar tareas. Cada operación modifica el estado del sistema de manera controlada, demostrando los principios de la programación imperativa.

## Comparación de Paradigmas: Imperativo, Funcional y Orientado a Objetos

Vamos a comparar cómo se implementaría un programa que calcula la suma de números pares en un arreglo utilizando los paradigmas imperativo, funcional y orientado a objetos.

### Paradigma Imperativo

```typescript
function sumEvenNumbersImperative(arr: number[]): number {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] % 2 === 0) {
      sum += arr[i];
    }
  }
  return sum;
}

// Uso del programa
const numbersImperative = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log(sumEvenNumbersImperative(numbersImperative)); // Output: 30
```

### Paradigma Funcional

```typescript
function sumEvenNumbersFunctional(arr: number[]): number {
  return arr.filter(num => num % 2 === 0).reduce((acc, num) => acc + num, 0);
}

// Uso del programa
const numbersFunctional = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log(sumEvenNumbersFunctional(numbersFunctional)); // Output: 30
```

### Paradigma Orientado a Objetos

```typescript
class NumberArray {
  constructor(private numbers: number[]) {}

  sumEvenNumbers(): number {
    let sum = 0;
    for (const num of this.numbers) {
      if (num % 2 === 0) {
        sum += num;
      }
    }
    return sum;
  }
}

// Uso del programa
const numberArray = new NumberArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
console.log(numberArray.sumEvenNumbers()); // Output: 30
```

En estos ejemplos, podemos ver cómo el mismo problema se resuelve de diferentes maneras según el paradigma de programación utilizado. El enfoque imperativo se centra en describir paso a paso cómo realizar la tarea, el enfoque funcional utiliza funciones puras y operaciones de alto nivel, y el enfoque orientado a objetos encapsula el comportamiento dentro de una clase.

## Casos de Uso

- **Evaluación de expresiones matemáticas complejas**: El enfoque imperativo es útil para evaluar expresiones matemáticas complejas que requieren un seguimiento detallado de las operaciones realizadas.
- **Manipulación de estructuras de datos mutables**: Cuando se necesita modificar estructuras de datos mutables, como arreglos o objetos, la programación imperativa es una opción adecuada.
- **Interacción con hardware**: La programación imperativa es útil para interactuar con hardware y realizar operaciones de bajo nivel que requieren un control preciso sobre el flujo de ejecución.
- **scripts de automatización**: Para escribir scripts de automatización que realicen tareas específicas en un orden secuencial, la programación imperativa es una elección común.
