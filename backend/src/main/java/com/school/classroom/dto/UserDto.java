package com.school.classroom.dto;

public record UserDto(
    Long id,
    String username,
    String email,
    String fullName,
    String role
) {}
