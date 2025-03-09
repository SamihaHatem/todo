import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TaskI } from '../../core/interfaces/task.interface';
import { TaskService } from '../../core/services/task/task.service';
import { Subscription } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { inject, signal, TemplateRef, WritableSignal } from '@angular/core';

import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent implements OnInit, AfterViewInit, OnDestroy {

  displayedColumns: string[] = ['id', 'title', 'completed', 'userId', 'delete'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  isLoading: boolean = true;
  isError: boolean = false;

  ELEMENT_DATA: TaskI[] = [];
  dataSource = new MatTableDataSource<TaskI>();

  allTasksSubscription: Subscription = new Subscription();
  deleteTaskSubscription: Subscription = new Subscription();
  updateTaskSubscription: Subscription = new Subscription();

  selectedTask!: TaskI

  private modalService = inject(NgbModal);
  closeResult: WritableSignal<string> = signal('');

  constructor(private tasksServices: TaskService) { }

  open(content: TemplateRef<any>, element: any) {

    this.selectedTask = JSON.parse(JSON.stringify(element));
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        this.closeResult.set(`Closed with: ${result}`);
      },
      (reason) => {
        this.closeResult.set(`Dismissed ${this.getDismissReason(reason)}`);
      },
    );
  }

  private getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }

  deleteTask() {
    if (this.selectedTask && this.selectedTask.id) {
      this.tasksServices.deleteTask(this.selectedTask.id).subscribe((response: any) => {
        console.log(response)
        Swal.fire({
          title: 'Done',
          icon: 'success'
        }).then(() => {
          this.getAllTasks()
          this.modalService.dismissAll()
        })
      }, (err: any) => {
        console.log(err)
        Swal.fire({
          title: 'Error',
          icon: 'error'
        })
      })
    }
  }

  updateTask() {
    this.tasksServices.updateTask(this.selectedTask).subscribe((response: any) => {
      console.log(response)
      Swal.fire({
        title: 'Done',
        icon: 'success'
      }).then(() => {
        this.getAllTasks()
        this.modalService.dismissAll()
      })
    }, (err: any) => {
      console.log(err)
      Swal.fire({
        title: 'Error',
        icon: 'error'
      })
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getAllTasks() {
    this.isLoading = true
    this.isError = false
    this.ELEMENT_DATA = [];
    this.dataSource = new MatTableDataSource<TaskI>(this.ELEMENT_DATA);

    this.allTasksSubscription = this.tasksServices.getTasks().subscribe((response: any) => {
      this.ELEMENT_DATA = response
      this.dataSource = new MatTableDataSource<TaskI>(this.ELEMENT_DATA);
      this.dataSource.paginator = this.paginator;
      this.isLoading = false
      this.isError = false
    }, (err: any) => {
      console.log(err)
      this.isLoading = false
      this.isError = true
    })
  }

  ngOnInit(): void {
    this.getAllTasks()
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  ngOnDestroy(): void {
    this.allTasksSubscription.unsubscribe();
    this.deleteTaskSubscription.unsubscribe();
    this.updateTaskSubscription.unsubscribe();
  }

}

