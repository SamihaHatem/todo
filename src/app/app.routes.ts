import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'tasks', pathMatch: 'full' },
    { path: 'tasks', loadComponent: () => import('./features/tasks/tasks.component').then((c) => c.TasksComponent) },
    { path: 'task/new', loadComponent: () => import('./features/task/task.component').then((c) => c.TaskComponent) },
    { path: '**', loadComponent: () => import('./shared/notfound/notfound.component').then((c) => c.NotfoundComponent) }
];
