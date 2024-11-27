import { TaskService } from "./TaskService"
import { HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { Task } from "../model/Task";
import { Observable } from "rxjs";

describe('TaskService', () => {
  let taskService: TaskService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj<HttpClient>('HttpClient', ['get', 'post']);
    taskService = new TaskService(httpClientSpy);
  })

  fit('should get the tasks using http client', (done: DoneFn) => {
    const expectedTasks: Task[] = [
      { id: 'toto', title: 'hello' },
      { id: 'tata', title: 'world' },
    ];

    httpClientSpy.get.and.returnValue(new Observable((subscriber) => {
      subscriber.next(expectedTasks);
      subscriber.complete();
    }));

    // We have to subscribe before calling getTasks otherwise the result is never caught
    taskService.tasks.subscribe({
      next: (tasks) => {
        expect(tasks).toEqual(expectedTasks);
        done();
      },
      error: done.fail
    });

    taskService.getTasks();

    expect(httpClientSpy.get.calls.count()).toBe(1);

  })

  fit('should create a new task using http client', (done: DoneFn) => {

    const expectedUuid = 'toto';

    httpClientSpy.post.and.returnValue(new Observable((subscriber) => {
      subscriber.next(expectedUuid);
      subscriber.complete();
    }));

    taskService.createTask('test').subscribe({
      next: (uuid) => {
        expect(uuid).toBe(expectedUuid);
        done();
      },
      error: done.fail
    })

    expect(httpClientSpy.post.calls.count()).toBe(1);
    expect(httpClientSpy.post).toHaveBeenCalledWith(jasmine.any(String), { title: 'test' })

  })
})