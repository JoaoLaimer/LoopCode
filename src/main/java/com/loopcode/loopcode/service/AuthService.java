package com.loopcode.loopcode.service;

import com.loopcode.loopcode.domain.user.User;
import com.loopcode.loopcode.dtos.AuthResponseDto;
import com.loopcode.loopcode.dtos.LoginRequestDto;
import com.loopcode.loopcode.dtos.RegisterRequestDto;
import com.loopcode.loopcode.exceptions.UserAlreadyExistsException;
import com.loopcode.loopcode.repositories.UserRepository;
import com.loopcode.loopcode.security.Role;
import com.loopcode.loopcode.security.JwtService;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService,
            AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public AuthResponseDto register(RegisterRequestDto requestDto) {
        if (userRepository.existsByUsername(requestDto.username())) {
            throw new UserAlreadyExistsException("Username already exists.");
        }
        if (userRepository.existsByEmail(requestDto.email())) { // Corrigido para existsByEmail
            throw new UserAlreadyExistsException("Email already exists.");
        }

        User newUser = new User();
        newUser.setUsername(requestDto.username());
        newUser.setEmail(requestDto.email());
        newUser.setPassword(passwordEncoder.encode(requestDto.password()));
        newUser.setRole(requestDto.role() != null ? requestDto.role() : Role.USER);
        newUser.setDaily_streak(0);

        userRepository.save(newUser);
        // tem que meter uma exceção aqui spa
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                newUser.getUsername(),
                null,
                newUser.getAuthorities());

        String jwtToken = jwtService.generateToken(authentication);
        return new AuthResponseDto(jwtToken, newUser.getUsername(), newUser.getRole(), "Registration successful!");
    }

    public AuthResponseDto login(LoginRequestDto requestDto) {
        User foundUser = userRepository.findByEmail(requestDto.email())
                .orElseThrow(() -> new BadCredentialsException("Email ou senha inválidos."));

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        foundUser.getUsername(),
                        requestDto.password()));

        String jwtToken = jwtService.generateToken(authentication);

        return new AuthResponseDto(
                jwtToken,
                foundUser.getUsername(),
                foundUser.getRole(),
                "Login successful!");
    }
}