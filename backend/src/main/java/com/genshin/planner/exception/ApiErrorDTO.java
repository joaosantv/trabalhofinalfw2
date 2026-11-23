package com.genshin.planner.exception;

import java.time.LocalDateTime;
import java.util.Map;

public record ApiErrorDTO(
        LocalDateTime timestamp,
        int status,
        String erro,
        String mensagem,
        String path,
        Map<String, String> errosValidacao
) {
}
