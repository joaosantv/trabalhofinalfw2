package com.genshin.planner.service;

import com.genshin.planner.dto.ElementoResponseDTO;
import com.genshin.planner.exception.ResourceNotFoundException;
import com.genshin.planner.model.Elemento;
import com.genshin.planner.repository.ElementoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ElementoService {

    private final ElementoRepository elementoRepository;

    public ElementoService(ElementoRepository elementoRepository) {
        this.elementoRepository = elementoRepository;
    }

    @Transactional(readOnly = true)
    public List<ElementoResponseDTO> listarTodos() {
        return elementoRepository.findAll()
                .stream()
                .map(ElementoResponseDTO::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public Elemento buscarEntidadePorId(Long id) {
        return elementoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Elemento não encontrado com id: " + id));
    }
}
