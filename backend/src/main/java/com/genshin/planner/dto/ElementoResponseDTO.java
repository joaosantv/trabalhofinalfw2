package com.genshin.planner.dto;

import com.genshin.planner.model.Elemento;

public record ElementoResponseDTO(
        Long id,
        String nome,
        String corHex
) {
    public static ElementoResponseDTO fromEntity(Elemento elemento) {
        return new ElementoResponseDTO(
                elemento.getId(),
                elemento.getNome(),
                elemento.getCorHex()
        );
    }
}
