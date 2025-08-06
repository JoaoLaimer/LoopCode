package com.loopcode.loopcode.config;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.loopcode.loopcode.domain.language.ProgrammingLanguage;
import com.loopcode.loopcode.domain.user.User;
import com.loopcode.loopcode.repositories.ExerciseRepository;
import com.loopcode.loopcode.repositories.ProgrammingLanguageRepository;
import com.loopcode.loopcode.repositories.UserRepository;
import com.loopcode.loopcode.security.Role;

import io.jsonwebtoken.io.IOException;

@Configuration
public class DataInitializer {

    private final PasswordEncoder passwordEncoder;

    private final UserRepository userRepository;

    DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    @Bean
CommandLineRunner initDatabase(ProgrammingLanguageRepository languagesRepository,
                                UserRepository userRepository) {
    return args -> {
        if (userRepository.count() == 0) {
            System.out.println("Populating database with users.");

            List<User> defaultUsers = new ArrayList<>();
            defaultUsers.add(new User("admin", "admin@example.com", passwordEncoder.encode("password"), 0, Role.ADMIN));
            defaultUsers.add(new User("user", "user@example.com", passwordEncoder.encode("password"), 0, Role.USER));

            // Read mockUsers.txt from resources
            try (InputStream inputStream = getClass().getClassLoader().getResourceAsStream("mockUsers.txt")) {
                if (inputStream == null) {
                    System.err.println("mockUsers.txt not found in resources!");
                } else {
                    BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
                    String line;
                    while ((line = reader.readLine()) != null) {
                        String email = line.trim();
                        if (!email.isEmpty()) {
                            String username = email.split("@")[0];
                            defaultUsers.add(new User(username, email, passwordEncoder.encode("password"), 0, Role.USER));
                        }
                    }
                }
            } catch (IOException e) {
                System.err.println("Failed to read mockUsers.txt: " + e.getMessage());
            }

            userRepository.saveAll(defaultUsers);
        }

        if (languagesRepository.count() == 0) {
            System.out.println("Populating database with programming languages.");
            languagesRepository.saveAll(List.of(
                new ProgrammingLanguage("Java", "java"),
                new ProgrammingLanguage("Python", "python"),
                new ProgrammingLanguage("C", "c"),
                new ProgrammingLanguage("C++", "cpp")
            ));
        }

        System.out.println("Languages inserted: " + languagesRepository.count());
        System.out.println("Users inserted: " + userRepository.count());
    };
}


}
