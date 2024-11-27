import { TestBed } from '@angular/core/testing';
import { TaskFormComponent } from './task-form.component';
import { TaskService } from '../service/TaskService';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Observable } from 'rxjs';

describe('TaskFormComponent', () => {
  let taskServiceSpy: jasmine.SpyObj<TaskService>;
  beforeEach(async () => {
    taskServiceSpy = jasmine.createSpyObj<TaskService>('TaskService', [
      'createTask',
      'getTasks',
    ]);
    await TestBed.configureTestingModule({
      providers: [{ provide: TaskService, useValue: taskServiceSpy }],
      imports: [TaskFormComponent, NoopAnimationsModule],
    }).compileComponents();
  });

  it('should have an input for a task title', () => {
    const fixture = TestBed.createComponent(TaskFormComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('input')?.name).toContain('title');
  });

  it('should have a button to create tasks', () => {
    const fixture = TestBed.createComponent(TaskFormComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('button')?.textContent).toContain(
      'Create task'
    );
  });

  it('should update input value when user types', async () => {
    const fixture = TestBed.createComponent(TaskFormComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    component.titleFormControl.setValue('Toto');
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('input')?.value).toContain('Toto');
  });

  it('should call task service when title is set and "create task" is clicked', async () => {
    // Setup service spy
    taskServiceSpy.createTask.and.returnValue(
      new Observable(subscriber => {
        subscriber.next('test');
        subscriber.complete();
      })
    );

    // Setup interface
    const taskTitle = 'Toto';
    const fixture = TestBed.createComponent(TaskFormComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    component.titleFormControl.setValue(taskTitle);
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button');
    button?.click();

    // Assert
    await fixture.whenStable();
    expect(compiled.querySelector('input')?.value).toBeFalsy();
    expect(taskServiceSpy.createTask.calls.count()).toBe(1);
    expect(taskServiceSpy.createTask).toHaveBeenCalledWith(taskTitle);
    expect(taskServiceSpy.getTasks.calls.count()).toBe(1);
  });
});
