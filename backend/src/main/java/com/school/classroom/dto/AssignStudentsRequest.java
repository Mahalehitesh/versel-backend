package com.school.classroom.dto;

import jakarta.validation.constraints.NotEmpty;
import java.util.Set;

public record AssignStudentsRequest(
    @NotEmpty(message = "At least one student ID is required")
    Set<Long> studentIds
) {}
