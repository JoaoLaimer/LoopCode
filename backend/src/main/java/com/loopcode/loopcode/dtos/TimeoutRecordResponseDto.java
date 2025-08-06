package com.loopcode.loopcode.dtos;

import java.time.LocalDateTime;

public record TimeoutRecordResponseDto(
        Long id,
        String timedOutUsername,
        String timedOutUserEmail,
        String adminUsername,
        String reason,
        LocalDateTime timeoutDate,
        int durationMinutes,
        LocalDateTime timeoutEndDate,
        boolean active
) {
}
