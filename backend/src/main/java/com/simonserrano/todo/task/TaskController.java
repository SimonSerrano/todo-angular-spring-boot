package com.simonserrano.todo.task;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.Errors;
import org.springframework.validation.FieldError;
import org.springframework.validation.Validator;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
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
  @CrossOrigin(origins = "http://localhost:4200")
  public Flux<Task> getTasks() {
    return taskService.findAll();
  }

  @GetMapping("{id}")
  @ResponseBody
  @CrossOrigin(origins = "http://localhost:4200")
  public Mono<Task> getTaskById(@PathVariable("id") UUID uuid) {
    return taskService.findById(uuid);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  @ResponseBody
  @CrossOrigin(origins = "http://localhost:4200")
  public Mono<UUID> postTask(@RequestBody TaskForm taskForm) {
    validate(taskForm);
    var result = taskService.save(taskForm);
    return result.map(task -> task.getId());
  }

  @ResponseStatus(HttpStatus.BAD_REQUEST)
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public Map<String, String> handleValidationExceptions(MethodArgumentNotValidException ex) {
    Map<String, String> errors = new HashMap<>();
    ex.getBindingResult().getAllErrors().forEach((error) -> {
      String fieldName = ((FieldError) error).getField();
      String errorMessage = error.getDefaultMessage();
      errors.put(fieldName, errorMessage);
    });
    return errors;
  }

  private void validate(TaskForm taskForm) {
    Errors errors = new BeanPropertyBindingResult(taskForm, "taskForm");
    validator.validate(taskForm, errors);
    if (errors.hasErrors()) {
      throw new ServerWebInputException(errors.toString());
    }
  }

}
