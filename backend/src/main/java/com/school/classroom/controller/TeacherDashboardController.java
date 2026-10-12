package com.school.classroom.controller;

import com.school.classroom.dto.ClassroomResponse;
import com.school.classroom.dto.StudentDetailResponse;
import com.school.classroom.dto.StudentResponse;
import com.school.classroom.dto.TeacherDashboardResponse;
import com.school.classroom.service.ClassroomService;
import com.school.classroom.service.StudentService;
import com.school.classroom.service.TeacherDashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/teacher")
@RequiredArgsConstructor
@Tag(name = "Teacher Dashboard", description = "Teacher specific endpoints for dashboard, classrooms, and student view with access control")
public class TeacherDashboardController {

    private final TeacherDashboardService teacherDashboardService;
    private final ClassroomService classroomService;
    private final StudentService studentService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    @Operation(summary = "Get teacher dashboard grouped by current, previous, and future terms")
    public ResponseEntity<TeacherDashboardResponse> getTeacherDashboard(
            Authentication authentication,
            @RequestParam(required = false) Long teacherId) {
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        return ResponseEntity.ok(teacherDashboardService.getTeacherDashboard(authentication.getName(), isAdmin, teacherId));
    }

    @GetMapping("/classrooms/{id}")
    @PreAuthorize("@teacherSecurityService.isAssignedToClassroom(#id, authentication)")
    @Operation(summary = "Get classroom details by ID for assigned teacher or admin")
    public ResponseEntity<ClassroomResponse> getClassroomDetails(@PathVariable Long id) {
        return ResponseEntity.ok(classroomService.getClassroomById(id));
    }

    @GetMapping("/classrooms/{id}/students")
    @PreAuthorize("@teacherSecurityService.isAssignedToClassroom(#id, authentication)")
    @Operation(summary = "Get searchable, sortable, paginated list of students in an assigned classroom")
    public ResponseEntity<Page<StudentResponse>> getClassroomStudents(
            @PathVariable Long id,
            @RequestParam(required = false) String query,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(classroomService.getClassroomStudents(id, query, pageable));
    }

    @GetMapping("/students/{id}")
    @PreAuthorize("@teacherSecurityService.isAssignedToStudent(#id, authentication)")
    @Operation(summary = "Get full student detail for an assigned student")
    public ResponseEntity<StudentDetailResponse> getStudentDetail(
            @PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudentDetailById(id));
    }
}
