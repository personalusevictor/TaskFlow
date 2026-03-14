package com.treeco.api.controller;

import com.treeco.api.model.Project;
import com.treeco.api.service.ProjectService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    public record ProjectRequest(String name, String description, Integer userId) {}

    public record ProjectUpdateRequest(String name, String description) {}

    // ── GET /projects ────────────────────────────────────────────────────
    @GetMapping
    public ResponseEntity<?> getAllProjects() {
        return ResponseEntity.ok(projectService.getProjects());
    }

    // ── GET /projects?userId= ────────────────────────────────────────────
    @GetMapping(params = "userId")
    public ResponseEntity<?> getProjectsByUser(@RequestParam @NonNull Integer userId) {
        try {
            return ResponseEntity.ok(projectService.getProjectsByUser(userId));
        } catch (NoSuchElementException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ── GET /projects/{id} ───────────────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<?> getProject(@PathVariable @NonNull Integer id) {
        try {
            return ResponseEntity.ok(projectService.findById(id));
        } catch (NoSuchElementException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ── POST /projects ───────────────────────────────────────────────────
    @PostMapping
    public ResponseEntity<?> createProject(@RequestBody ProjectRequest request) {
        try {
            if (request.name() == null || request.userId() == null) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Los campos 'name' y 'userId' son obligatorios"));
            }
            Project project = projectService.createProject(
                    request.userId(), request.name(), request.description());
            return ResponseEntity.status(HttpStatus.CREATED).body(project);

        } catch (NoSuchElementException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ── PATCH /projects/{id} ─────────────────────────────────────────────
    @PatchMapping("/{id}")
    public ResponseEntity<?> updateProject(@PathVariable @NonNull Integer id,
            @RequestBody ProjectUpdateRequest request) {
        try {
            Project project = projectService.updateProject(id, request.name(), request.description());
            return ResponseEntity.ok(project);
        } catch (NoSuchElementException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ── DELETE /projects/{id} ────────────────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable @NonNull Integer id) {
        try {
            projectService.deleteProject(id);
            return ResponseEntity.ok(Map.of("message", "Proyecto eliminado correctamente"));
        } catch (NoSuchElementException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ── GET /projects/{id}/progress ──────────────────────────────────────
    @GetMapping("/{id}/progress")
    public ResponseEntity<?> getProgress(@PathVariable @NonNull Integer id) {
        try {
            return ResponseEntity.ok(Map.of(
                    "projectId", id,
                    "progress", projectService.getProgress(id)));
        } catch (NoSuchElementException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}