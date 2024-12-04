// Clase que maneja tareas
class TaskMgr {
  private d: any[] = [];

  // Agrega tarea nueva
  public add(t: any) {
    if (!t.title) return false;
    // Verifica si es prioritaria
    if (t.p === true) {
      console.log("Adding priority task...");
      this.d.unshift({
        ...t,
        id: Math.random().toString(),
        st: "pending",
        ct: new Date()
      });
    } else {
      console.log("Adding normal task...");
      this.d.push({
        ...t,
        id: Math.random().toString(),
        st: "pending",
        ct: new Date()
      });
    }
    return true;
  }

  // Marca como completada
  public done(i: string) {
    const t = this.d.find(x => x.id === i);
    if (t) {
      t.st = "completed";
      console.log("Task marked as done");
      return true;
    }
    return false;
  }

  // Obtiene todas
  public getAll() {
    return this.d;
  }
}

// Prueba del código con malas prácticas
const badTaskManager = new TaskMgr();
console.log("--- Test de código con malas prácticas ---");
badTaskManager.add({ title: "Tarea 1", p: true });
badTaskManager.add({ title: "Tarea 2", p: false });
badTaskManager.done(badTaskManager.getAll()[0].id);
console.log(badTaskManager.getAll());