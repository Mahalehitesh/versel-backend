package com.school.classroom.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.ZonedDateTime;

@Entity
@Table(name = "departure_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepartureHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "entity_type", nullable = false, length = 20)
    private String entityType; // "STUDENT" or "TEACHER"

    @Column(name = "original_id")
    private Long originalId;

    @Column(nullable = false, length = 50)
    private String identifier;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(length = 100)
    private String email;

    @Column(length = 50)
    private String phone;

    @Column(name = "department_or_grade", length = 100)
    private String departmentOrGrade;

    @Column(length = 20)
    private String gender;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "enrollment_or_joining_date")
    private LocalDate enrollmentOrJoiningDate;

    @Column(name = "departure_date", nullable = false)
    private ZonedDateTime departureDate;

    @Column(name = "guardian_info", length = 255)
    private String guardianInfo;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "previous_classrooms", columnDefinition = "TEXT")
    private String previousClassrooms;

    @Column(name = "deleted_by", length = 50)
    private String deletedBy;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private ZonedDateTime createdAt;
}
