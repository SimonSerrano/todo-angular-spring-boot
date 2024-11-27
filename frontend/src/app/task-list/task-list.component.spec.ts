import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TaskService } from '../service/TaskService';
import { TaskListComponent } from './task-list.component';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../model/Task';

describe('TaskListComponent', () => {
  let taskServiceSpy: jasmine.SpyObj<TaskService>;

  beforeEach(async () => {
    taskServiceSpy = jasmine.createSpyObj<TaskService>('TaskService', [
      'getTasks',
      'tasks',
    ]);
    await TestBed.configureTestingModule({
      providers: [{ provide: TaskService, useValue: taskServiceSpy }],
      imports: [TaskListComponent, NoopAnimationsModule],
    }).compileComponents();
  });

  it('should render empty list', () => {
    taskServiceSpy.tasks = new BehaviorSubject([] as Task[]);
    const fixture = TestBed.createComponent(TaskListComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-card-title')?.textContent).toContain(
      'Task list'
    );
  });

  fit('should render task list', () => {
    const tasks = [
      { id: 'toto', title: 'test' },
      { id: 'tata', title: 'haha' },
    ];
    taskServiceSpy.tasks = new BehaviorSubject(tasks);
    const fixture = TestBed.createComponent(TaskListComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const matListItems = Array.from(compiled.querySelectorAll('mat-list-item'));
    expect(matListItems.length).toBe(2);

    expect(
      matListItems[0].querySelector('span[role="title"]')?.textContent
    ).toContain(tasks[0].title);
    expect(
      matListItems[0].querySelector('span[role="subtitle"]')?.textContent
    ).toContain(tasks[0].id);

    expect(
      matListItems[1].querySelector('span[role="title"]')?.textContent
    ).toContain(tasks[1].title);
    expect(
      matListItems[1].querySelector('span[role="subtitle"]')?.textContent
    ).toContain(tasks[1].id);
  });
});
