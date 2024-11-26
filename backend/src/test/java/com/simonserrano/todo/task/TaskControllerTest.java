package com.simonserrano.todo.task;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.WebFluxTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.web.reactive.function.BodyInserters;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@ExtendWith(SpringExtension.class)
@WebFluxTest(TaskController.class)
public class TaskControllerTest {

    @Autowired
    private WebTestClient webTestClient;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private TaskService taskService;

    @Test
    public void shouldReturnTaskList() {

        Task[] tasks = new Task[] {
                new Task("toto"),
                new Task("tata")
        };

        when(taskService.findAll())
                .thenReturn(Flux
                        .fromArray(tasks));

        webTestClient
                .get()
                .uri("/tasks")
                .accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectStatus()
                .isOk()
                .expectHeader()
                .contentType(MediaType.APPLICATION_JSON)
                .expectBodyList(Task.class)
                .hasSize(2)
                .isEqualTo(Arrays.asList(tasks));
    }

    @Test
    public void shouldCreateATask() throws JsonProcessingException {

        var taskForm = new TaskForm().setTitle("My task");
        var createdTask = mock(Task.class);
        var uuid = new UUID(0, 0);

        when(createdTask.getTitle()).thenReturn("My task");
        when(createdTask.getId()).thenReturn(uuid);

        when(taskService.save(any(TaskForm.class))).thenReturn(Mono.just(createdTask));

        var body = objectMapper
                .writeValueAsString(taskForm);

        webTestClient
                .post()
                .uri("/tasks")
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromValue(body))
                .exchange()
                .expectStatus()
                .isCreated();

        verify(taskService).save(any(TaskForm.class));
    }

    @Test
    public void shouldReturnInvalidForm() throws JsonProcessingException {
        webTestClient
                .post()
                .uri("/tasks")
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromValue(
                        objectMapper
                                .writeValueAsString(
                                        new TaskForm())))
                .exchange()
                .expectStatus()
                .isBadRequest();
    }

}
