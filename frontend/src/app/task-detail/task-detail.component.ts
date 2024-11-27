import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TaskService } from '../service/TaskService';
import { Task } from '../model/Task';
import { Subscription } from 'rxjs';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatChip } from '@angular/material/chips';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-task-detail',
  imports: [MatDialogContent, MatDialogActions, MatChip, MatButton],
  templateUrl: './task-detail.component.html',
})
export class TaskDetailComponent implements OnInit, OnDestroy {
  taskService = inject(TaskService);
  subscription?: Subscription;
  task?: Task;
  uuid = inject<string>(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<TaskDetailComponent>);

  cancel() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    if (!this.uuid) {
      throw new Error('TaskDetailComponent requires a uuid as an input');
    }
    this.subscription = this.taskService
      .getTask(this.uuid)
      .subscribe(task => (this.task = task));
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
