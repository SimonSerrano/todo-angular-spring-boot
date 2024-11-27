package com.simonserrano.todo.task;

import java.util.Objects;

import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

public class TaskFormValidator implements Validator {

  @Override
  public boolean supports(Class<?> clazz) {
    return TaskForm.class.equals(clazz);
  }

  @Override
  public void validate(Object target, Errors errors) {
    ValidationUtils.rejectIfEmpty(errors, "title", "title.empty");

    TaskForm tf = (TaskForm) target;
    if (!Objects.isNull(tf.getTitle()) && tf.getTitle().length() < 1) {
      errors.rejectValue("title", "title.too.short");
    }
  }

}
