

import { TaskManager, TaskStatus } from '../src/taskRefactor';

describe('TaskManager', () => {
  let taskManager: TaskManager;

  beforeEach(() => {
    taskManager = new TaskManager();
  });

  test('should add a new task', () => {
    const result = taskManager.addTask('New Task', false);
    const tasks = taskManager.getAllTasks();

    expect(result).toBe(true);
    expect(tasks.length).toBe(1);
    expect(tasks[0].title).toBe('New Task');
    expect(tasks[0].isPriority).toBe(false);
    expect(tasks[0].status).toBe(TaskStatus.PENDING);
  });

  test('should add a priority task', () => {
    const result = taskManager.addTask('Priority Task', true);
    const tasks = taskManager.getAllTasks();

    expect(result).toBe(true);
    expect(tasks.length).toBe(1);
    expect(tasks[0].title).toBe('Priority Task');
    expect(tasks[0].isPriority).toBe(true);
    expect(tasks[0].status).toBe(TaskStatus.PENDING);
  });

  test('should mark a task as completed', () => {
    taskManager.addTask('Task to Complete', false);
    const taskId = taskManager.getAllTasks()[0].id;
    const result = taskManager.completeTask(taskId);
    const tasks = taskManager.getAllTasks();

    expect(result).toBe(true);
    expect(tasks[0].status).toBe(TaskStatus.COMPLETED);
  });

  test('should return false when marking a non-existent task as completed', () => {
    const result = taskManager.completeTask('non-existent-id');
    expect(result).toBe(false);
  });

  test('should get all tasks', () => {
    taskManager.addTask('Task 1', false);
    taskManager.addTask('Task 2', true);
    const tasks = taskManager.getAllTasks();

    expect(tasks.length).toBe(2);
    expect(tasks[0].title).toBe('Task 2'); // Priority task should be first
    expect(tasks[1].title).toBe('Task 1');
  });
});