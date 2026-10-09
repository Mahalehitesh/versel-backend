package com.school.classroom.controller;

import com.school.classroom.dto.TermRequest;
import com.school.classroom.dto.TermResponse;
import com.school.classroom.service.TermService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/terms")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Terms Management", description = "Admin CRUD endpoints for school terms")
public class TermController {

    private final TermService termService;

    @GetMapping
    @Operation(summary = "Get all terms")
    public ResponseEntity<List<TermResponse>> getAllTerms() {
        return ResponseEntity.ok(termService.getAllTerms());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get term by ID")
    public ResponseEntity<TermResponse> getTermById(@PathVariable Long id) {
        return ResponseEntity.ok(termService.getTermById(id));
    }

    @PostMapping
    @Operation(summary = "Create a new term")
    public ResponseEntity<TermResponse> createTerm(@Valid @RequestBody TermRequest request) {
        return new ResponseEntity<>(termService.createTerm(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update term by ID")
    public ResponseEntity<TermResponse> updateTerm(@PathVariable Long id, @Valid @RequestBody TermRequest request) {
        return ResponseEntity.ok(termService.updateTerm(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete term by ID")
    public ResponseEntity<Void> deleteTerm(@PathVariable Long id) {
        termService.deleteTerm(id);
        return ResponseEntity.noContent().build();
    }
}
