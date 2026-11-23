package com.genshin.planner.dto;

public record AuthResponseDTO(
        String token,
        String nome,
        String email
) {
}
