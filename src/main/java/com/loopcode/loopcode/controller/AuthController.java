package com.loopcode.loopcode.controller;

import com.loopcode.loopcode.dtos.AuthResponseDto;
import com.loopcode.loopcode.dtos.LoginRequestDto;
import com.loopcode.loopcode.dtos.RegisterRequestDto;
import com.loopcode.loopcode.exceptions.UserAlreadyExistsException;
import com.loopcode.loopcode.service.AuthService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDto> register(@RequestBody @Valid RegisterRequestDto requestDto) {
        try {
            AuthResponseDto response = authService.register(requestDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (UserAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new AuthResponseDto(null, null, null, e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@RequestBody @Valid LoginRequestDto requestDto) {
        try {
            AuthResponseDto response = authService.login(requestDto);
            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponseDto(null, null, null, e.getMessage()));
        }
    }
}