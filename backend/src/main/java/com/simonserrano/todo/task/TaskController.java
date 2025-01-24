package com.simonserrano.todo.task;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ServerWebInputException;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Controller
@RequestMapping("/tasks")
public class TaskController {

  @Autowired
  private TaskService taskService;

  private final Validator validator = new TaskFormValidator();

  @GetMapping
  @ResponseBody
  public Flux<Task> getTasks() {
    return taskService.findAll();
  }

  @GetMapping("{id}")
  @ResponseBody
  public Mono<ResponseEntity<Task>> getTaskById(@PathVariable("id") UUID uuid) {
    return taskService
        .findById(uuid)
        .map(task -> ResponseEntity.ok(task))
        .defaultIfEmpty(ResponseEntity.notFound().build());
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  @ResponseBody
  public Mono<UUID> postTask(@RequestBody TaskForm taskForm) {
    validate(taskForm);
    var result = taskService.save(taskForm);
    return result.map(task -> task.getId());
  }

  private void validate(TaskForm taskForm) {
    Errors errors = new BeanPropertyBindingResult(taskForm, "taskForm");
    validator.validate(taskForm, errors);
    if (errors.hasErrors()) {
      throw new ServerWebInputException(errors.toString());
    }
  }

}
