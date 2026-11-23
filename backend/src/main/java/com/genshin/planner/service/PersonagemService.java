package com.genshin.planner.service;

import com.genshin.planner.dto.PersonagemRequestDTO;
import com.genshin.planner.dto.PersonagemResponseDTO;
import com.genshin.planner.exception.ForbiddenException;
import com.genshin.planner.exception.ResourceNotFoundException;
import com.genshin.planner.model.Elemento;
import com.genshin.planner.model.Personagem;
import com.genshin.planner.model.Usuario;
import com.genshin.planner.repository.PersonagemRepository;
import com.genshin.planner.repository.UsuarioRepository;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PersonagemService {

    private final PersonagemRepository personagemRepository;
    private final ElementoService elementoService;
    private final UsuarioRepository usuarioRepository;

    public PersonagemService(
            PersonagemRepository personagemRepository,
            ElementoService elementoService,
            UsuarioRepository usuarioRepository
    ) {
        this.personagemRepository = personagemRepository;
        this.elementoService = elementoService;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional(readOnly = true)
    public List<PersonagemResponseDTO> listarTodos() {
        Usuario usuario = usuarioAutenticado();
        return personagemRepository.findByUsuarioId(usuario.getId())
                .stream()
                .map(PersonagemResponseDTO::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public PersonagemResponseDTO buscarPorId(Long id) {
        return PersonagemResponseDTO.fromEntity(buscarDoUsuario(id, usuarioAutenticado()));
    }

    @Transactional
    public PersonagemResponseDTO criar(PersonagemRequestDTO dto) {
        Usuario usuario = usuarioAutenticado();
        Elemento elemento = elementoService.buscarEntidadePorId(dto.elementoId());

        Personagem personagem = new Personagem();
        aplicarDados(personagem, dto, elemento);
        personagem.setUsuario(usuario);

        return PersonagemResponseDTO.fromEntity(personagemRepository.save(personagem));
    }

    @Transactional
    public PersonagemResponseDTO atualizar(Long id, PersonagemRequestDTO dto) {
        Personagem personagem = buscarDoUsuario(id, usuarioAutenticado());
        Elemento elemento = elementoService.buscarEntidadePorId(dto.elementoId());

        aplicarDados(personagem, dto, elemento);

        return PersonagemResponseDTO.fromEntity(personagemRepository.save(personagem));
    }

    @Transactional
    public void deletar(Long id) {
        Personagem personagem = buscarDoUsuario(id, usuarioAutenticado());
        personagemRepository.delete(personagem);
    }

    // Garante que o personagem existe e pertence ao usuario logado
    private Personagem buscarDoUsuario(Long id, Usuario usuario) {
        Personagem personagem = personagemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Personagem não encontrado com id: " + id));
        if (!personagem.getUsuario().getId().equals(usuario.getId())) {
            throw new ForbiddenException("Você não tem permissão para acessar este personagem");
        }
        return personagem;
    }

    private Usuario usuarioAutenticado() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth instanceof AnonymousAuthenticationToken) {
            throw new AuthenticationCredentialsNotFoundException("Usuário não autenticado");
        }
        return usuarioRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new AuthenticationCredentialsNotFoundException("Usuário autenticado não encontrado"));
    }

    private void aplicarDados(Personagem personagem, PersonagemRequestDTO dto, Elemento elemento) {
        personagem.setNome(dto.nome());
        personagem.setRaridade(dto.raridade());
        personagem.setArmaEquipada(dto.armaEquipada());
        personagem.setNivel(dto.nivel());
        personagem.setStatusBuild(dto.statusBuild());
        personagem.setConjuntoArtefatos(dto.conjuntoArtefatos());
        personagem.setStatusAlvo(dto.statusAlvo());
        personagem.setObservacoes(dto.observacoes());
        personagem.setImagemUrl(dto.imagemUrl());
        personagem.setElemento(elemento);
    }
}
