package com.simonserrano.todo.task;

import java.util.UUID;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;

public interface TaskRepository extends ReactiveCrudRepository<Task, UUID> {

}
