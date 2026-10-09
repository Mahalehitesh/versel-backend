package com.school.classroom;

import com.school.classroom.repository.ClassroomRepository;
import com.school.classroom.security.TeacherSecurityService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SecurityAccessTest {

    @Mock
    private ClassroomRepository classroomRepository;

    private TeacherSecurityService teacherSecurityService;

    @BeforeEach
    void setUp() {
        teacherSecurityService = new TeacherSecurityService(classroomRepository);
    }

    @Test
    @DisplayName("Admin user should be granted access to any classroom regardless of assignment")
    void testAdminAccessGranted() {
        Authentication adminAuth = new UsernamePasswordAuthenticationToken(
            "admin", "password", List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
        );

        assertTrue(teacherSecurityService.isAssignedToClassroom(100L, adminAuth));
    }

    @Test
    @DisplayName("Teacher assigned to classroom should be granted access")
    void testAssignedTeacherAccessGranted() {
        Authentication teacherAuth = new UsernamePasswordAuthenticationToken(
            "t_smith", "password", List.of(new SimpleGrantedAuthority("ROLE_TEACHER"))
        );

        when(classroomRepository.isTeacherAssignedToClassroom(100L, "t_smith")).thenReturn(true);

        assertTrue(teacherSecurityService.isAssignedToClassroom(100L, teacherAuth));
    }

    @Test
    @DisplayName("Unassigned teacher should be denied access to classroom")
    void testUnassignedTeacherAccessDenied() {
        Authentication teacherAuth = new UsernamePasswordAuthenticationToken(
            "t_wilson", "password", List.of(new SimpleGrantedAuthority("ROLE_TEACHER"))
        );

        when(classroomRepository.isTeacherAssignedToClassroom(100L, "t_wilson")).thenReturn(false);

        assertFalse(teacherSecurityService.isAssignedToClassroom(100L, teacherAuth));
    }
}
