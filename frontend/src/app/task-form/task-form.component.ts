import { Component, inject } from '@angular/core';
import { TaskService } from '../service/TaskService';
import {
  FormControl,
  FormGroupDirective,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-task-form',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css',
})
export class TaskFormComponent {
  taskService = inject(TaskService);
  titleFormControl = new FormControl('', [Validators.required]);
  matcher = new MyErrorStateMatcher();

  onSubmit(formDirective: NgForm) {
    if (this.titleFormControl.valid && this.titleFormControl.value) {
      this.taskService.createTask(this.titleFormControl.value).subscribe(() => {
        this.taskService.getTasks();
        formDirective.resetForm();
        this.titleFormControl.reset();
      });
    }
  }
}
