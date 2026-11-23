package com.genshin.planner.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiErrorDTO> handleResourceNotFound(
            ResourceNotFoundException ex,
            HttpServletRequest request
    ) {
        return buildErrorResponse(
                HttpStatus.NOT_FOUND,
                "Recurso não encontrado",
                ex.getMessage(),
                request.getRequestURI(),
                Collections.emptyMap()
        );
    }

    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<ApiErrorDTO> handleForbidden(ForbiddenException ex, HttpServletRequest request) {
        return buildErrorResponse(HttpStatus.FORBIDDEN, "Acesso negado", ex.getMessage(),
                request.getRequestURI(), Collections.emptyMap());
    }

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ApiErrorDTO> handleConflict(ConflictException ex, HttpServletRequest request) {
        return buildErrorResponse(HttpStatus.CONFLICT, "Conflito", ex.getMessage(),
                request.getRequestURI(), Collections.emptyMap());
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiErrorDTO> handleAuthentication(AuthenticationException ex, HttpServletRequest request) {
        return buildErrorResponse(HttpStatus.UNAUTHORIZED, "Não autenticado", ex.getMessage(),
                request.getRequestURI(), Collections.emptyMap());
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiErrorDTO> handleAccessDenied(AccessDeniedException ex, HttpServletRequest request) {
        return buildErrorResponse(HttpStatus.FORBIDDEN, "Acesso negado",
                "Você não tem permissão para acessar este recurso.",
                request.getRequestURI(), Collections.emptyMap());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorDTO> handleValidationErrors(
            MethodArgumentNotValidException ex,
            HttpServletRequest request
    ) {
        Map<String, String> errosValidacao = new LinkedHashMap<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            errosValidacao.putIfAbsent(fieldError.getField(), fieldError.getDefaultMessage());
        }

        return buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                "Erro de validação",
                "Um ou mais campos estão inválidos. Verifique os detalhes em 'errosValidacao'.",
                request.getRequestURI(),
                errosValidacao
        );
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiErrorDTO> handleHttpMessageNotReadable(
            HttpMessageNotReadableException ex,
            HttpServletRequest request
    ) {
        return buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                "Requisição malformada",
                "Corpo JSON inválido ou valor incompatível. Para statusBuild, utilize: WISHLIST, FARMANDO ou PRONTO.",
                request.getRequestURI(),
                Collections.emptyMap()
        );
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiErrorDTO> handleIllegalArgument(
            IllegalArgumentException ex,
            HttpServletRequest request
    ) {
        return buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                "Argumento inválido",
                ex.getMessage(),
                request.getRequestURI(),
                Collections.emptyMap()
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorDTO> handleGenericException(
            Exception ex,
            HttpServletRequest request
    ) {
        return buildErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Erro interno do servidor",
                "Ocorreu um erro inesperado ao processar a requisição.",
                request.getRequestURI(),
                Collections.emptyMap()
        );
    }

    private ResponseEntity<ApiErrorDTO> buildErrorResponse(
            HttpStatus status,
            String erro,
            String mensagem,
            String path,
            Map<String, String> errosValidacao
    ) {
        ApiErrorDTO body = new ApiErrorDTO(
                LocalDateTime.now(),
                status.value(),
                erro,
                mensagem,
                path,
                errosValidacao
        );
        return ResponseEntity.status(status).body(body);
    }
}
