package com.genshin.planner.repository;

import com.genshin.planner.model.Personagem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PersonagemRepository extends JpaRepository<Personagem, Long> {
    List<Personagem> findByUsuarioId(Long usuarioId);
}
