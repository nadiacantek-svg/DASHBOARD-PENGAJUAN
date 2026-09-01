package com.fspengajuan.api;

import com.fspengajuan.api.model.User;
import com.fspengajuan.api.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class ApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(ApiApplication.class, args);
    }

    @Bean
    public CommandLineRunner dataSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            User admin = userRepository.findByUsername("admin").orElseGet(() -> {
                User u = new User();
                u.setName("Admin Fakultas");
                u.setUsername("admin");
                u.setEmail("admin@example.com");
                u.setRole("admin");
                return u;
            });
            admin.setPassword(passwordEncoder.encode("admin123"));
            userRepository.save(admin);
            System.out.println("Admin user ready: username 'admin', password 'admin123'");
        };
    }
}
