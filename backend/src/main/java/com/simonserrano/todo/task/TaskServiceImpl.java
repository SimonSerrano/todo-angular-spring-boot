package com.simonserrano.todo.task;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Scheduler;

@Component("taskService")
public class TaskServiceImpl implements TaskService {

  @Autowired
  private TaskRepository taskRepository;

  @Autowired
  @Qualifier("jdbcScheduler")
  private Scheduler jdbScheduler;

  @Override
  public Flux<Task> findAll() {
    Flux<Task> defer = Flux.defer(() -> Flux.fromIterable(taskRepository.findAll()));
    return defer.subscribeOn(jdbScheduler);
  }

  @Override
  public Mono<Task> save(TaskForm taskForm) {
    return Mono.fromCallable(() -> {
      Task task = new Task(taskForm.getTitle());
      Task savedTask = taskRepository.save(task);
      return savedTask;
    }).subscribeOn(jdbScheduler);
  }

}
