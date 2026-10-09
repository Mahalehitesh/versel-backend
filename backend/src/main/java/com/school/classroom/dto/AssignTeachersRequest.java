package com.school.classroom.dto;

import jakarta.validation.constraints.NotEmpty;
import java.util.Set;

public record AssignTeachersRequest(
    @NotEmpty(message = "At least one teacher ID is required")
    Set<Long> teacherIds
) {}
