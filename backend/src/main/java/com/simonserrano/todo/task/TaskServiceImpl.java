package com.simonserrano.todo.task;

import java.util.UUID;

import org.springframework.stereotype.Component;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Component("taskService")
public class TaskServiceImpl implements TaskService {

  private TaskRepository taskRepository;

  public TaskServiceImpl(TaskRepository taskRepository) {
    this.taskRepository = taskRepository;
  }

  @Override
  public Flux<Task> findAll() {
    return taskRepository.findAll();
  }

  @Override
  public Mono<Task> save(TaskForm taskForm) {
    Task task = new Task(taskForm.getTitle());
    return taskRepository.save(task);
  }

  @Override
  public Mono<Task> findById(UUID uuid) {
    Mono<Task> task = taskRepository.findById(uuid);
    return task;
  }

}
