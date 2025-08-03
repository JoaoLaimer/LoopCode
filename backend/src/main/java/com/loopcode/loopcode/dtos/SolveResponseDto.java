package com.loopcode.loopcode.dtos;

import java.util.List;

public record SolveResponseDto(
                List<TestCaseResultDto> output,
                boolean passed,
                String feedback,
                String expectedOutput) {
}
