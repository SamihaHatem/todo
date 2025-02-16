import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../core/services/task/task.service';
import { TaskI } from '../../core/interfaces/task.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent {

  constructor(private tasksServices: TaskService) { }

  fb: FormBuilder = new FormBuilder()

  taskForm = this.fb.group({
    userId: ['', [Validators.required]],
    title: ['', [Validators.required]],
    completed: [false, [Validators.required]],
  });

  onSubmit() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched()
    }
    else {
      console.log(this.taskForm.value)
      this.tasksServices.addTask(this.taskForm.value as TaskI).subscribe((response: any) => {
        console.log(response)
        Swal.fire({
          title:'Done',
          icon:'success'
        }).then(()=>{
          this.taskForm.reset()
        })
      }, (err: any) => {
        console.log(err)
      })
    }
  }
}
