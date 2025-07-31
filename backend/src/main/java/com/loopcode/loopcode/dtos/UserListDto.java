package com.loopcode.loopcode.dtos;

import java.util.List;

public record UserListDto(
                Long id,
                String name,
                String ownerUsername,
                List<ExerciseResponseDto> exercises) {
}
