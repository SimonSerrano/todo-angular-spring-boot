package com.simonserrano.todo.task;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class TaskForm {

  @NotNull
  @Size(min = 1)
  private String title;

  public TaskForm setTitle(String title) {
    this.title = title;
    return this;
  }

  public String getTitle() {
    return title;
  }

}
