package com.simonserrano.todo.task;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface TaskService {
  Flux<Task> findAll();

  Mono<Task> save(TaskForm task);
}
