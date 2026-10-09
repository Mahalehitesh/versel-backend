package com.school.classroom.dto;

public record AuthResponse(
    String token,
    String refreshToken,
    String type,
    Long id,
    String username,
    String email,
    String fullName,
    String role
) {
    public AuthResponse(String token, String refreshToken, Long id, String username, String email, String fullName, String role) {
        this(token, refreshToken, "Bearer", id, username, email, fullName, role);
    }
}
