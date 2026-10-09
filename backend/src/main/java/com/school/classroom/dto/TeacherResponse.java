package com.school.classroom.dto;

public record TeacherResponse(
    Long id,
    Long userId,
    String username,
    String email,
    String fullName,
    String employeeId,
    String department,
    String phone
) {}
