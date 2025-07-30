package com.loopcode.loopcode.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TimeoutRequestDto {
    @Size(max = 500)
    private String reason;

    @Min(value = 1)
    private int durationMinutes;
}
