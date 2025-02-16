import { Injectable } from '@angular/core';
import { TaskI } from '../../interfaces/task.interface';
import { delay, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private tasks: TaskI[] = [
    { id: 1, title: 'Task 1', completed: false, userId: 1 },
    { id: 2, title: 'Task 2', completed: true, userId: 1 },
    { id: 3, title: 'Task 3', completed: false, userId: 3 },
    { id: 4, title: 'Task 4', completed: false, userId: 1 },
    { id: 5, title: 'Task 5', completed: true, userId: 1 },
    { id: 6, title: 'Task 6', completed: false, userId: 1 },
    { id: 7, title: 'Task 7', completed: false, userId: 1 },

  ];

  constructor() { }

  // ---  Get all Tasks ---
  getTasks(): Observable<TaskI[]> {
    return of(this.tasks);
  }

  // --- Add a new task ---
  addTask(task: TaskI): Observable<TaskI> {
    const newTask = { ...task, id: this.tasks.length + 1 };
    this.tasks.push(newTask);
    return of(newTask).pipe(delay(500));
  }

  // --- Delete a task by ID ---
  deleteTask(id: number): Observable<void> {
    this.tasks = this.tasks.filter(task => task.id !== id);
    return of(undefined).pipe(delay(500));
  }

  // --- Update a task by ID ---
  updateTask(updatedTask: TaskI): Observable<TaskI> {
    const index = this.tasks.findIndex(task => task.id === updatedTask.id);
    if (index !== -1) {
      this.tasks[index] = updatedTask;
    }
    return of(updatedTask).pipe(delay(500));
  }
}
