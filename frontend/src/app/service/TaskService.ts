import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task } from '../model/Task';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private url = 'http://localhost:8080/tasks';

  public tasks = new Subject<Task[]>();

  constructor(private http: HttpClient) {}

  getTasks() {
    this.http
      .get<Task[]>(this.url)
      .subscribe(tasks => this.tasks.next(tasks.reverse()));
  }

  createTask(title: string) {
    return this.http.post<string>(this.url, { title });
  }

  getTask(uuid: string) {
    return this.http.get<Task>(`${this.url}/${uuid}`);
  }
}
