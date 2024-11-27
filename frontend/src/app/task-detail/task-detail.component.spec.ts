import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDetailComponent } from './task-detail.component';
import { TaskService } from '../service/TaskService';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Task } from '../model/Task';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

fdescribe('TaskDetailComponent', () => {
  let fixture: ComponentFixture<TaskDetailComponent>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;
  let matDialogRefSpy: jasmine.SpyObj<MatDialogRef<TaskDetailComponent>>;
  const task: Task = { id: 'toto', title: 'yes' };

  beforeEach(async () => {
    taskServiceSpy = jasmine.createSpyObj<TaskService>('TaskService', [
      'getTask',
    ]);
    matDialogRefSpy = jasmine.createSpyObj<MatDialogRef<TaskDetailComponent>>(
      'MatDialogRef',
      ['close']
    );
    await TestBed.configureTestingModule({
      providers: [
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: MatDialogRef, useValue: matDialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: 'test' },
      ],
      imports: [TaskDetailComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskDetailComponent);

    taskServiceSpy.getTask.and.returnValue(
      new Observable(subscriber => {
        subscriber.next(task);
        subscriber.complete();
      })
    );

    fixture.detectChanges();
  });

  it('should display task details', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h3')?.textContent).toContain(task.title);
  });

  it('should display cancel button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('button')?.textContent).toContain('Cancel');
  });

  it('should display uuid', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-chip')?.textContent).toContain(task.id);
  });
});
