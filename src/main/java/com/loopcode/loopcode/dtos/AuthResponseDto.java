package com.loopcode.loopcode.dtos;

import com.loopcode.loopcode.security.Role;

public record AuthResponseDto(
        String token,
        String username,
        Role role,
        String message) {
}