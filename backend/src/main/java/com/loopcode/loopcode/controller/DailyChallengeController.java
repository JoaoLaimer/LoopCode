package com.loopcode.loopcode.controller;

import com.loopcode.loopcode.domain.exercise.Exercise;
import com.loopcode.loopcode.dtos.ExerciseResponseDto;
import com.loopcode.loopcode.service.DailyChallengeService;
import com.loopcode.loopcode.service.ExerciseService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.security.core.Authentication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@SpringBootApplication
@RestController
@RequestMapping("/daily-challenge")
@Tag(name = "Daily-Challenge", description = "Endpoints do Desafio Diário")
public class DailyChallengeController {

    private final DailyChallengeService service;
    private final ExerciseService exerciseService; 

    public DailyChallengeController(DailyChallengeService service,
                                    ExerciseService exerciseService) {
        this.service = service;
        this.exerciseService = exerciseService;
    }

    @GetMapping
    @Operation(summary = "Retorna o exercício do dia")
    public ResponseEntity<ExerciseResponseDto> getDailyChallenge() {
        return service.getDailyChallenge()
                .map(ex -> exerciseService.getExerciseById(ex.getId()))
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/resolve")
    @Operation(summary = "Marca o desafio como resolvido pelo usuário logado")
    public ResponseEntity<Void> resolveDaily(Authentication auth) {
        service.resolveDaily(auth.getName());
        return ResponseEntity.ok().build();
    }
}
