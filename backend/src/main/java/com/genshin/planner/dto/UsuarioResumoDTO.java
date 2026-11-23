package com.genshin.planner.dto;

import com.genshin.planner.model.Usuario;

public record UsuarioResumoDTO(
        Long id,
        String nome,
        String email
) {
    public static UsuarioResumoDTO fromEntity(Usuario usuario) {
        return new UsuarioResumoDTO(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail()
        );
    }
}
