package com.simonserrano.todo.task;

import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

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

  @Override
  public Mono<Task> findById(UUID uuid) {
    return Mono.fromCallable(() -> {
      Optional<Task> task = taskRepository.findById(uuid);
      if (!task.isPresent()) {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND);
      }
      return task.get();
    }).subscribeOn(jdbScheduler);
  }

}
