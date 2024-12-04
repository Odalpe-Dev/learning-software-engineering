/**
 * En esta versión refactorizada, se aplican los principios de Clean Code:

Se utilizan nombres descriptivos para las variables, funciones y clases.
Se define una interfaz Task para la estructura de una tarea.
Se utiliza un enum TaskStatus para los estados de la tarea.
Se separan las responsabilidades en métodos claros y concisos.
Se mejora la legibilidad y mantenibilidad del código.
 */

// Enum para el estado de la tarea
export enum TaskStatus {
  PENDING = 'pending',
  COMPLETED = 'completed'
}

// Interfaz para la estructura de una tarea
interface Task {
  id: string;
  title: string;
  isPriority: boolean;
  status: TaskStatus;
  createdAt: Date;
}

// Clase que maneja tareas
export class TaskManager {
  private tasks: Task[] = [];

  // Agrega una nueva tarea
  public addTask(title: string, isPriority: boolean): boolean {

    const newTask: Task = {
      id: this.generateId(),
      title,
      isPriority,
      status: TaskStatus.PENDING,
      createdAt: new Date()
    };

    if (isPriority) {
      console.log('Adding priority task...');
      this.tasks.unshift(newTask);
    } else {
      console.log('Adding normal task...');
      this.tasks.push(newTask);
    }

    return true;
  }

  // Marca una tarea como completada
  public completeTask(taskId: string): boolean {
    const task = this.tasks.find(task => task.id === taskId);
    if (task) {
      task.status = TaskStatus.COMPLETED;
      console.log('Task marked as done');
      return true;
    }
    console.error('Task not found');
    return false;
  }

  // Obtiene todas las tareas
  public getAllTasks(): Task[] {
    return this.tasks;
  }

  // Genera un ID único para cada tarea
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

// Prueba del código refactorizado
const taskManager = new TaskManager();
console.log('--- Test de código refactorizado ---');
taskManager.addTask('Tarea 1', true);
taskManager.addTask('Tarea 2', false);
taskManager.completeTask(taskManager.getAllTasks()[0].id);
console.log(taskManager.getAllTasks());

