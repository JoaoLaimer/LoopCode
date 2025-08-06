package com.loopcode.loopcode.dtos;

import java.util.List;

public record UserListDto(
                Long id,
                String name,
                String description,
                java.time.LocalDateTime createdAt,
                String ownerUsername,
                List<ExerciseResponseDto> exercises) {
}
