package com.school.classroom.dto;

import com.school.classroom.entity.TermStatus;
import java.time.LocalDate;

public record TermResponse(
    Long id,
    String name,
    LocalDate startDate,
    LocalDate endDate,
    TermStatus status
) {}
