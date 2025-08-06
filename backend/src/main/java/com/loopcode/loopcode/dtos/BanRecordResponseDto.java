package com.loopcode.loopcode.dtos;

import java.time.LocalDateTime;

public record BanRecordResponseDto(
        Long id,
        String bannedUsername,
        String bannedUserEmail,
        String adminUsername,
        String banReason,
        LocalDateTime banDate,
        LocalDateTime unbanDate,
        boolean active
) {
}
