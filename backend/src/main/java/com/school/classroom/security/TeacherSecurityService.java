package com.school.classroom.security;

import com.school.classroom.repository.ClassroomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;

import org.springframework.stereotype.Service;

@Service("teacherSecurityService")
@RequiredArgsConstructor
public class TeacherSecurityService {

    private final ClassroomRepository classroomRepository;

    public boolean isAssignedToClassroom(Long classroomId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        // Admin has full access
        boolean isAdmin = authentication.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (isAdmin) {
            return true;
        }

        String username = authentication.getName();
        return classroomRepository.isTeacherAssignedToClassroom(classroomId, username);
    }

    public boolean isAssignedToStudent(Long studentId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        // Admin has full access
        boolean isAdmin = authentication.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (isAdmin) {
            return true;
        }

        String username = authentication.getName();
        return classroomRepository.isTeacherAssignedToStudent(studentId, username);
    }
}
