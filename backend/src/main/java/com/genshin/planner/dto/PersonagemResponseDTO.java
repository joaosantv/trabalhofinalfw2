package com.genshin.planner.dto;

import com.genshin.planner.model.Personagem;
import com.genshin.planner.model.StatusBuild;

public record PersonagemResponseDTO(
        Long id,
        String nome,
        Integer raridade,
        String armaEquipada,
        Integer nivel,
        StatusBuild statusBuild,
        String conjuntoArtefatos,
        String statusAlvo,
        String observacoes,
        String imagemUrl,
        ElementoResponseDTO elemento,
        UsuarioResumoDTO usuario
) {
    public static PersonagemResponseDTO fromEntity(Personagem personagem) {
        return new PersonagemResponseDTO(
                personagem.getId(),
                personagem.getNome(),
                personagem.getRaridade(),
                personagem.getArmaEquipada(),
                personagem.getNivel(),
                personagem.getStatusBuild(),
                personagem.getConjuntoArtefatos(),
                personagem.getStatusAlvo(),
                personagem.getObservacoes(),
                personagem.getImagemUrl(),
                ElementoResponseDTO.fromEntity(personagem.getElemento()),
                UsuarioResumoDTO.fromEntity(personagem.getUsuario())
        );
    }
}
