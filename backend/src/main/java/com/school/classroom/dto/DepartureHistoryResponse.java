package com.school.classroom.dto;

import java.time.LocalDate;
import java.time.ZonedDateTime;

public record DepartureHistoryResponse(
    Long id,
    String entityType,
    Long originalId,
    String identifier,
    String fullName,
    String email,
    String phone,
    String departmentOrGrade,
    String gender,
    LocalDate dateOfBirth,
    LocalDate enrollmentOrJoiningDate,
    ZonedDateTime departureDate,
    String guardianInfo,
    String address,
    String notes,
    String previousClassrooms,
    String deletedBy,
    ZonedDateTime createdAt
) {}
