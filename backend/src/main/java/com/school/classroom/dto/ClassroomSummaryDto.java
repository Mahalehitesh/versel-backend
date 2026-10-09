package com.school.classroom.dto;

public record ClassroomSummaryDto(
    Long id,
    String name,
    String gradeSection,
    String subject,
    String roomNumber,
    String termName,
    String termStatus
) {}
