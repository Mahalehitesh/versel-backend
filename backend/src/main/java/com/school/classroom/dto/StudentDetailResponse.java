package com.school.classroom.dto;

import java.time.LocalDate;
import java.util.List;

public record StudentDetailResponse(
    Long id,
    String rollNumber,
    String firstName,
    String lastName,
    String fullName,
    LocalDate dateOfBirth,
    String gender,
    String grade,
    String contactEmail,
    String contactPhone,
    String guardianName,
    String guardianPhone,
    String address,
    LocalDate enrollmentDate,
    String notes,
    List<ClassroomSummaryDto> classrooms
) {}
