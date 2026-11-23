package com.genshin.planner.dto;

import com.genshin.planner.model.StatusBuild;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PersonagemRequestDTO(
        @NotBlank(message = "O nome do personagem é obrigatório")
        String nome,

        @NotNull(message = "A raridade é obrigatória")
        @Min(value = 4, message = "A raridade deve ser 4 ou 5")
        @Max(value = 5, message = "A raridade deve ser 4 ou 5")
        Integer raridade,

        @NotBlank(message = "A arma equipada é obrigatória")
        String armaEquipada,

        @NotNull(message = "O nível é obrigatório")
        @Min(value = 1, message = "O nível mínimo é 1")
        @Max(value = 90, message = "O nível máximo é 90")
        Integer nivel,

        @NotNull(message = "O status da build é obrigatório (WISHLIST, FARMANDO ou PRONTO)")
        StatusBuild statusBuild,

        @NotBlank(message = "O conjunto de artefatos é obrigatório")
        String conjuntoArtefatos,

        @NotBlank(message = "Os status alvo são obrigatórios")
        String statusAlvo,

        String observacoes,

        String imagemUrl,

        @NotNull(message = "O elementoId é obrigatório")
        Long elementoId
) {
}
