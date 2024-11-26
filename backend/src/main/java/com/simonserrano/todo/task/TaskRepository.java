package com.simonserrano.todo.task;

import java.util.UUID;

import org.springframework.data.repository.CrudRepository;

public interface TaskRepository extends CrudRepository<Task, UUID> {

}
