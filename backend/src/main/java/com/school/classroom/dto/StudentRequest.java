package com.school.classroom.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record StudentRequest(
    @NotBlank(message = "Roll number is required")
    String rollNumber,

    @NotBlank(message = "First name is required")
    String firstName,

    @NotBlank(message = "Last name is required")
    String lastName,

    @NotNull(message = "Date of birth is required")
    LocalDate dateOfBirth,

    @NotBlank(message = "Gender is required")
    String gender,

    @NotBlank(message = "Grade is required")
    String grade,

    @Email(message = "Invalid contact email")
    String contactEmail,

    String contactPhone,

    @NotBlank(message = "Guardian name is required")
    String guardianName,

    @NotBlank(message = "Guardian phone is required")
    String guardianPhone,

    @NotBlank(message = "Address is required")
    String address,

    @NotNull(message = "Enrollment date is required")
    LocalDate enrollmentDate,

    String notes
) {}
