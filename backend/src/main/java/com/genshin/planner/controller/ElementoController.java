package com.genshin.planner.controller;

import com.genshin.planner.dto.ElementoResponseDTO;
import com.genshin.planner.service.ElementoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// Endpoint público que devolve os 7 elementos populados no banco
@RestController
@RequestMapping("/elementos")
@Tag(name = "Elementos", description = "Consulta dos 7 elementos de Genshin Impact")
public class ElementoController {

    private final ElementoService elementoService;

    public ElementoController(ElementoService elementoService) {
        this.elementoService = elementoService;
    }

    @GetMapping
    @Operation(summary = "Listar elementos", description = "Retorna todos os elementos disponíveis com nome e cor hexadecimal.")
    @ApiResponse(responseCode = "200", description = "Lista de elementos retornada com sucesso")
    public ResponseEntity<List<ElementoResponseDTO>> listarTodos() {
        return ResponseEntity.ok(elementoService.listarTodos());
    }
}
