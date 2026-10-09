package com.school.classroom.controller;

import com.school.classroom.dto.*;
import com.school.classroom.service.ClassroomService;
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
@RequestMapping("/api/classrooms")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Classrooms Management", description = "Admin CRUD endpoints for classrooms and teacher/student assignments")
public class ClassroomController {

    private final ClassroomService classroomService;

    @GetMapping
    @Operation(summary = "Get all classrooms")
    public ResponseEntity<List<ClassroomResponse>> getAllClassrooms() {
        return ResponseEntity.ok(classroomService.getAllClassrooms());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get classroom by ID")
    public ResponseEntity<ClassroomResponse> getClassroomById(@PathVariable Long id) {
        return ResponseEntity.ok(classroomService.getClassroomById(id));
    }

    @PostMapping
    @Operation(summary = "Create classroom")
    public ResponseEntity<ClassroomResponse> createClassroom(@Valid @RequestBody ClassroomRequest request) {
        return new ResponseEntity<>(classroomService.createClassroom(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update classroom")
    public ResponseEntity<ClassroomResponse> updateClassroom(@PathVariable Long id, @Valid @RequestBody ClassroomRequest request) {
        return ResponseEntity.ok(classroomService.updateClassroom(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete classroom")
    public ResponseEntity<Void> deleteClassroom(@PathVariable Long id) {
        classroomService.deleteClassroom(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/teachers")
    @Operation(summary = "Assign teachers to classroom")
    public ResponseEntity<ClassroomResponse> assignTeachers(
            @PathVariable Long id,
            @Valid @RequestBody AssignTeachersRequest request) {
        return ResponseEntity.ok(classroomService.assignTeachers(id, request.teacherIds()));
    }

    @DeleteMapping("/{id}/teachers/{teacherId}")
    @Operation(summary = "Remove teacher from classroom")
    public ResponseEntity<ClassroomResponse> removeTeacher(
            @PathVariable Long id,
            @PathVariable Long teacherId) {
        return ResponseEntity.ok(classroomService.removeTeacher(id, teacherId));
    }

    @PostMapping("/{id}/students")
    @Operation(summary = "Assign students to classroom")
    public ResponseEntity<ClassroomResponse> assignStudents(
            @PathVariable Long id,
            @Valid @RequestBody AssignStudentsRequest request) {
        return ResponseEntity.ok(classroomService.assignStudents(id, request.studentIds()));
    }

    @DeleteMapping("/{id}/students/{studentId}")
    @Operation(summary = "Remove student from classroom")
    public ResponseEntity<ClassroomResponse> removeStudent(
            @PathVariable Long id,
            @PathVariable Long studentId) {
        return ResponseEntity.ok(classroomService.removeStudent(id, studentId));
    }

    @GetMapping("/{id}/students")
    @Operation(summary = "Get paginated students in classroom with optional search query")
    public ResponseEntity<Page<StudentResponse>> getClassroomStudents(
            @PathVariable Long id,
            @RequestParam(required = false) String query,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(classroomService.getClassroomStudents(id, query, pageable));
    }
}
