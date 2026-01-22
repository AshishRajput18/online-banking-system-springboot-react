package com.backend.config;

import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.*;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.*;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .cors().and()
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll() // Auth endpoints open
                .requestMatchers("/api/admin/**").permitAll() // Only ADMIN can access
                .requestMatchers(HttpMethod.POST, "/api/customer/register").permitAll()
                .requestMatchers("/api/bank/account/**").permitAll()
                .requestMatchers("/api/customer/**").permitAll()
                .requestMatchers("/api/transactions/**").permitAll()
                .requestMatchers("/api/bank/**").permitAll()
                 // ✅ VERY IMPORTANT FOR CORS
            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
//                .requestMatchers("/api/admin/**").permitAll()
                .requestMatchers("/api/**").permitAll()
                
                .anyRequest().authenticated()
            );

        // ✅ Add JWT filter
        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
