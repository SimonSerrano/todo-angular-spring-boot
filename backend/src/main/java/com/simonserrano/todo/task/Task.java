package com.simonserrano.todo.task;

import java.util.UUID;

import org.springframework.data.annotation.Id;

public class Task {

  @Id
  private UUID id;

  private String title;

  public Task() {
  }

  public Task(String title) {
    this.title = title;
  }

  public UUID getId() {
    return id;
  }

  public String getTitle() {
    return title;
  }

  protected Task setId(UUID id) {
    this.id = id;
    return this;
  }

  protected Task setTitle(String title) {
    this.title = title;
    return this;
  }

  @Override
  public int hashCode() {
    final int prime = 31;
    int result = 1;
    result = prime * result + ((id == null) ? 0 : id.hashCode());
    result = prime * result + ((title == null) ? 0 : title.hashCode());
    return result;
  }

  @Override
  public boolean equals(Object obj) {
    if (this == obj)
      return true;
    if (obj == null)
      return false;
    if (getClass() != obj.getClass())
      return false;
    Task other = (Task) obj;
    if (id == null) {
      if (other.id != null)
        return false;
    } else if (!id.equals(other.id))
      return false;
    if (title == null) {
      if (other.title != null)
        return false;
    } else if (!title.equals(other.title))
      return false;
    return true;
  }

}
