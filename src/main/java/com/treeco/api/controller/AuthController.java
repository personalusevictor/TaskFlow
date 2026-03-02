package com.treeco.api.controller;

import com.treeco.api.model.User;
import com.treeco.api.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public record RegisterRequest(String username, String email, String password) {}
    public record LoginRequest(String email, String password) {}

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            if (request.username() == null || request.email() == null || request.password() == null) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Todos los campos son obligatorios"));
            }

            if (userRepository.findByEmailIgnoreCase(request.email()).isPresent()) {
                return ResponseEntity
                        .status(HttpStatus.CONFLICT)
                        .body(Map.of("error", "El email ya está registrado"));
            }

            User newUser = new User(request.username(), request.email(), request.password());
            userRepository.save(newUser);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(Map.of(
                            "message", "Usuario registrado correctamente",
                            "userId", newUser.getId(),
                            "username", newUser.getUsername()
                    ));

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            if (request.email() == null || request.password() == null) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Email y contraseña son obligatorios"));
            }

            Optional<User> userOpt = userRepository.findByEmailIgnoreCase(request.email());

            if (userOpt.isEmpty() || !userOpt.get().checkPassword(request.password())) {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Credenciales incorrectas"));
            }

            User user = userOpt.get();

            return ResponseEntity.ok(Map.of(
                    "message", "Login correcto",
                    "userId", user.getId(),
                    "username", user.getUsername(),
                    "email", user.getEmail()
            ));

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error inesperado"));
        }
    }
}