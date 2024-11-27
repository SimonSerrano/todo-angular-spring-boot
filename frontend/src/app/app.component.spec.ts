import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from './model/Task';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AppComponent', () => {
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(async () => {
    httpClientSpy = jasmine.createSpyObj<HttpClient>('HttpClient', ['get', 'post']);
    await TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: httpClientSpy }],
      imports: [AppComponent, NoopAnimationsModule],
    }).compileComponents();

  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'todo-app' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('todo-app');
  });

  it('should render title', () => {

    const expectedTasks: Task[] = [
      { id: 'toto', title: 'hello' },
      { id: 'tata', title: 'world' },
    ];

    httpClientSpy.get.and.returnValue(new Observable((subscriber) => {
      subscriber.next(expectedTasks);
      subscriber.complete();
    }));

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('todo-app');
  });
});
