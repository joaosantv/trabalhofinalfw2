package com.genshin.planner.controller;

import com.genshin.planner.dto.PersonagemRequestDTO;
import com.genshin.planner.dto.PersonagemResponseDTO;
import com.genshin.planner.service.PersonagemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// CRUD de builds de personagens (todas as rotas exigem Bearer Token)
@RestController
@RequestMapping("/personagens")
@Tag(name = "Personagens", description = "CRUD das builds de personagens do usuário logado")
@SecurityRequirement(name = "bearerAuth")
public class PersonagemController {

    private final PersonagemService personagemService;

    public PersonagemController(PersonagemService personagemService) {
        this.personagemService = personagemService;
    }

    @GetMapping
    @Operation(summary = "Listar meus personagens", description = "Retorna apenas as builds cadastradas pelo usuário autenticado.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso"),
            @ApiResponse(responseCode = "401", description = "Token ausente ou inválido")
    })
    public ResponseEntity<List<PersonagemResponseDTO>> listarTodos() {
        return ResponseEntity.ok(personagemService.listarTodos());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar personagem por ID", description = "Retorna os detalhes de uma build específica do usuário logado.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Personagem encontrado"),
            @ApiResponse(responseCode = "401", description = "Token ausente ou inválido"),
            @ApiResponse(responseCode = "403", description = "Personagem pertence a outro usuário"),
            @ApiResponse(responseCode = "404", description = "Personagem não encontrado")
    })
    public ResponseEntity<PersonagemResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(personagemService.buscarPorId(id));
    }

    @PostMapping
    @Operation(summary = "Criar personagem", description = "Cadastra uma nova build vinculada automaticamente ao usuário do token.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Personagem criado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Erro de validação nos campos enviados"),
            @ApiResponse(responseCode = "401", description = "Token ausente ou inválido"),
            @ApiResponse(responseCode = "404", description = "Elemento informado não existe")
    })
    public ResponseEntity<PersonagemResponseDTO> criar(@Valid @RequestBody PersonagemRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(personagemService.criar(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar personagem", description = "Atualiza os dados de uma build já cadastrada pelo usuário logado.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Personagem atualizado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Erro de validação nos campos enviados"),
            @ApiResponse(responseCode = "401", description = "Token ausente ou inválido"),
            @ApiResponse(responseCode = "403", description = "Personagem pertence a outro usuário"),
            @ApiResponse(responseCode = "404", description = "Personagem ou elemento não encontrado")
    })
    public ResponseEntity<PersonagemResponseDTO> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody PersonagemRequestDTO dto
    ) {
        return ResponseEntity.ok(personagemService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir personagem", description = "Remove a build do banco de dados.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Personagem removido com sucesso"),
            @ApiResponse(responseCode = "401", description = "Token ausente ou inválido"),
            @ApiResponse(responseCode = "403", description = "Personagem pertence a outro usuário"),
            @ApiResponse(responseCode = "404", description = "Personagem não encontrado")
    })
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        personagemService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
