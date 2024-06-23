package com.mlp.lab.config;

import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.PropertySources;

@Configuration
@PropertySources({
  @PropertySource("classpath:env.properties")
})
public class RootConfig {
  @Bean
  public ModelMapper getMapper(){
    ModelMapper modelMapper = new ModelMapper();
    modelMapper.getConfiguration()
    .setFieldMatchingEnabled(true)
    .setFieldAccessLevel(org.modelmapper.config
    .Configuration.AccessLevel.PRIVATE)
    .setMatchingStrategy(MatchingStrategies.LOOSE);
    return modelMapper;
  }
}
