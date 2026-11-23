package com.genshin.planner.repository;

import com.genshin.planner.model.Elemento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ElementoRepository extends JpaRepository<Elemento, Long> {
    Optional<Elemento> findByNomeIgnoreCase(String nome);
}
