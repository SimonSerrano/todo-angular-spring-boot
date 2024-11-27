import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { TaskService } from '../service/TaskService';
import { Subscription } from 'rxjs';
import { Task } from '../model/Task';
import { NgFor } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'task-list',
  imports: [MatListModule, NgFor, MatCardModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent implements OnInit, OnDestroy {
  title = 'Task list';
  taskService = inject(TaskService);
  subscription?: Subscription;
  tasks: Task[] = [];

  ngOnInit() {
    this.subscription = this.taskService.tasks.subscribe(tasks => {
      this.tasks = tasks;
    });
    this.taskService.getTasks();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
