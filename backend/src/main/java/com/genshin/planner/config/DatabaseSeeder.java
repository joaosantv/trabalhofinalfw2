package com.genshin.planner.config;

import com.genshin.planner.model.Elemento;
import com.genshin.planner.repository.ElementoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DatabaseSeeder {

    @Bean
    CommandLineRunner popularBanco(ElementoRepository elementoRepository) {
        return args -> {
            if (elementoRepository.count() == 0) {
                elementoRepository.saveAll(List.of(
                        new Elemento("Pyro", "#EF7938"),
                        new Elemento("Hydro", "#4CC2F1"),
                        new Elemento("Anemo", "#74C2A8"),
                        new Elemento("Electro", "#AF8EC1"),
                        new Elemento("Dendro", "#A5C83B"),
                        new Elemento("Cryo", "#9FD6E3"),
                        new Elemento("Geo", "#FAB632")
                ));
            }
        };
    }
}
