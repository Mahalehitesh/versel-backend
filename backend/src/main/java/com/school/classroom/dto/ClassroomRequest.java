package com.school.classroom.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ClassroomRequest(
    @NotBlank(message = "Classroom name is required")
    String name,

    @NotBlank(message = "Grade section is required")
    String gradeSection,

    @NotBlank(message = "Subject is required")
    String subject,

    @NotBlank(message = "Room number is required")
    String roomNumber,

    @NotNull(message = "Term ID is required")
    Long termId
) {}
