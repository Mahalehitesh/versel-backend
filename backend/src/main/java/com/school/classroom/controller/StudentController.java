package com.school.classroom.controller;

import com.school.classroom.dto.StudentDetailResponse;
import com.school.classroom.dto.StudentRequest;
import com.school.classroom.dto.StudentResponse;
import com.school.classroom.service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Students Management", description = "Admin CRUD endpoints for students")
public class StudentController {

    private final StudentService studentService;

    @GetMapping
    @Operation(summary = "Get paginated list of students")
    public ResponseEntity<Page<StudentResponse>> getAllStudents(@PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(studentService.getAllStudents(pageable));
    }

    @GetMapping("/all")
    @Operation(summary = "Get complete list of all students (unpaginated)")
    public ResponseEntity<List<StudentResponse>> getAllStudentsList() {
        return ResponseEntity.ok(studentService.getAllStudentsList());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get student by ID")
    public ResponseEntity<StudentResponse> getStudentById(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudentById(id));
    }

    @GetMapping("/{id}/detail")
    @Operation(summary = "Get full student detail including enrolled classrooms")
    public ResponseEntity<StudentDetailResponse> getStudentDetailById(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudentDetailById(id));
    }

    @PostMapping
    @Operation(summary = "Create student")
    public ResponseEntity<StudentResponse> createStudent(@Valid @RequestBody StudentRequest request) {
        return new ResponseEntity<>(studentService.createStudent(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update student")
    public ResponseEntity<StudentResponse> updateStudent(@PathVariable Long id, @Valid @RequestBody StudentRequest request) {
        return ResponseEntity.ok(studentService.updateStudent(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete student and record in past history with reason")
    public ResponseEntity<Void> deleteStudent(
            @PathVariable Long id,
            @RequestParam(required = false) String reason) {
        studentService.deleteStudent(id, reason);
        return ResponseEntity.noContent().build();
    }
}
