package com.simonserrano.todo.task;

import java.util.UUID;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface TaskService {
  Flux<Task> findAll();

  Mono<Task> findById(UUID uuid);

  Mono<Task> save(TaskForm task);

}
