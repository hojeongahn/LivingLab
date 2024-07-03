package com.mlp.lab.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;


import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Configuration
@Log4j2
@RequiredArgsConstructor
public class CustomSecurityConfig {
  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    log.info("-----------------------security config------------------------------");

    // CORS 설정
    http.cors(httpSecurityCorsConfigurer -> {
      httpSecurityCorsConfigurer.configurationSource(corsConfigurationSource());
    });

    http.sessionManagement(httpSecuritySessionManagementConfigurer -> {
      httpSecuritySessionManagementConfigurer.sessionCreationPolicy(SessionCreationPolicy.NEVER);
      // 세션 안 만들게 하는 것
    });

    // CSRF 설정
    http.csrf(httpSecurityCsrfCorsConfigurer -> httpSecurityCsrfCorsConfigurer.disable());

    // http.formLogin(config -> {
    // config.loginPage("/api/user/login");
    // config.successHandler(new APILoginSuccessHandler());
    // // config.failureHandler(new APILoginFailHandler());
    // });

    return http.build();
  }

  // 사용자 계정 암호화
  @Bean
  public PasswordEncoder PasswordEncoder() {
    return new BCryptPasswordEncoder();
  }

  // CORS 설정
  @Bean
  public CorsConfigurationSource corsConfigurationSource() {

    CorsConfiguration configuration = new CorsConfiguration();

    configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:3000"));
    configuration.setAllowedMethods(Arrays.asList("HEAD", "GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type"));
    configuration.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);

    return source;
  }
}