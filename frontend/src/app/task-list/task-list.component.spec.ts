import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TaskService } from '../service/TaskService';
import { TaskListComponent } from './task-list.component';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../model/Task';
import { MatDialog } from '@angular/material/dialog';

fdescribe('TaskListComponent', () => {
  let taskServiceSpy: jasmine.SpyObj<TaskService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    taskServiceSpy = jasmine.createSpyObj<TaskService>('TaskService', [
      'getTasks',
      'tasks',
    ]);
    dialogSpy = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
    await TestBed.configureTestingModule({
      providers: [
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
      ],
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

  it('should render task list', () => {
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

  it('should open dialog with task detail on click', () => {
    const tasks = [
      { id: 'toto', title: 'test' },
      { id: 'tata', title: 'haha' },
    ];
    taskServiceSpy.tasks = new BehaviorSubject(tasks);
    const fixture = TestBed.createComponent(TaskListComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const firstListItem = compiled.querySelector('mat-list-item');

    (firstListItem as HTMLElement | null)?.click();
    expect(dialogSpy.open.calls.count()).toBe(1);
  });
});
