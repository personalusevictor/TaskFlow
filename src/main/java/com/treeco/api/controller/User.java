package com.treeco.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.treeco.api.repository.UserRepository;

@RestController
@RequestMapping("api/user")
public class User {

    private final UserRepository userRepository;

    public User(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<?> getAllProjects() {
        return ResponseEntity.ok(userRepository.findAll());
    }
}