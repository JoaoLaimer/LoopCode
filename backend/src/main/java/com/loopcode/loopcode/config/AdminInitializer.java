package com.loopcode.loopcode.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.loopcode.loopcode.domain.user.User;
import com.loopcode.loopcode.repositories.UserRepository;
import com.loopcode.loopcode.security.Role;
import org.springframework.security.crypto.password.PasswordEncoder;

@Component
public class AdminInitializer implements CommandLineRunner {

    @Value("${ADMIN_PASSWORD}")
    private String adminPassword;

    private final UserRepository userRepo;
    private final PasswordEncoder encoder;

    public AdminInitializer(UserRepository userRepo, PasswordEncoder encoder) {
        this.userRepo = userRepo;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (!userRepo.existsById("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@example.com");
            admin.setPassword(encoder.encode(adminPassword));
            admin.setRole(Role.ADMIN);

            userRepo.save(admin);
            System.out.println("✔ Admin user created!");
        }
    }
}
