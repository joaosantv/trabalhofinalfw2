package com.genshin.planner.config;

import com.genshin.planner.exception.ApiErrorDTO;
import com.genshin.planner.repository.UsuarioRepository;
import com.genshin.planner.security.JwtAuthenticationFilter;
import com.genshin.planner.security.JwtService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.core.env.Profiles;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.servlet.util.matcher.PathPatternRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Configuration
public class SecurityConfig {

    private final tools.jackson.databind.ObjectMapper objectMapper;

    public SecurityConfig(tools.jackson.databind.ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtService jwtService,
            UsuarioRepository usuarioRepository,
            Environment env
    ) throws Exception {
        boolean dev = env.acceptsProfiles(Profiles.of("dev"));

        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .headers(h -> h.frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin))
                .authorizeHttpRequests(auth -> {
                    auth.requestMatchers(PathPatternRequestMatcher.pathPattern("/auth/**")).permitAll();
                    auth.requestMatchers(PathPatternRequestMatcher.pathPattern(HttpMethod.GET, "/elementos")).permitAll();
                    auth.requestMatchers(
                            PathPatternRequestMatcher.pathPattern("/swagger-ui/**"),
                            PathPatternRequestMatcher.pathPattern("/swagger-ui.html"),
                            PathPatternRequestMatcher.pathPattern("/v3/api-docs/**")
                    ).permitAll();
                    if (dev) {
                        auth.requestMatchers(PathPatternRequestMatcher.pathPattern("/h2-console/**")).permitAll();
                    }
                    auth.requestMatchers(
                            PathPatternRequestMatcher.pathPattern("/personagens"),
                            PathPatternRequestMatcher.pathPattern("/personagens/**")
                    ).authenticated();
                    auth.anyRequest().denyAll();
                })
                .exceptionHandling(e -> e
                        .authenticationEntryPoint((req, res, ex) -> escreverErro(
                                res, HttpServletResponse.SC_UNAUTHORIZED, "Não autenticado",
                                "Token ausente, inválido ou expirado. Envie 'Authorization: Bearer <token>'.",
                                req.getRequestURI()))
                        .accessDeniedHandler((req, res, ex) -> escreverErro(
                                res, HttpServletResponse.SC_FORBIDDEN, "Acesso negado",
                                "Você não tem permissão para acessar este recurso.",
                                req.getRequestURI())))
                .addFilterBefore(new JwtAuthenticationFilter(jwtService, usuarioRepository),
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource(
            @Value("${app.cors.allowed-origins:http://localhost:5173}") String origins
    ) {
        List<String> allowed = Arrays.stream(origins.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();

        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(allowed);
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    private void escreverErro(HttpServletResponse res, int status, String erro, String mensagem, String path)
            throws IOException {
        res.setStatus(status);
        res.setContentType(MediaType.APPLICATION_JSON_VALUE);
        res.setCharacterEncoding("UTF-8");
        ApiErrorDTO body = new ApiErrorDTO(LocalDateTime.now(), status, erro, mensagem, path, Map.of());
        res.getWriter().write(objectMapper.writeValueAsString(body));
    }
}
