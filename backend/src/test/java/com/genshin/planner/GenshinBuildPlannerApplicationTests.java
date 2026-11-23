package com.genshin.planner;

import com.genshin.planner.repository.ElementoRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class GenshinBuildPlannerApplicationTests {

    @Autowired
    private ElementoRepository elementoRepository;

    @Test
    void contextLoadsAndSeedsSevenElements() {
        assertEquals(7, elementoRepository.count());
    }
}
