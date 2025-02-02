package com.simonserrano.todo;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.config.CorsRegistry;
import org.springframework.web.reactive.config.WebFluxConfigurer;

@Configuration
public class TodoApplicationConfigurer implements WebFluxConfigurer {

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry
        .addMapping("/")
        .allowedOrigins("http://localhost:4200");
  }

}
