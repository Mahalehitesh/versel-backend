package com.school.classroom.service;

import com.school.classroom.dto.DepartureHistoryResponse;
import com.school.classroom.entity.DepartureHistory;
import com.school.classroom.entity.Student;
import com.school.classroom.entity.Teacher;
import com.school.classroom.exception.ResourceNotFoundException;
import com.school.classroom.repository.DepartureHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DepartureHistoryService {

    private final DepartureHistoryRepository historyRepository;

    @Transactional(readOnly = true)
    public Page<DepartureHistoryResponse> getHistory(String entityType, String query, Pageable pageable) {
        String type = (entityType != null && !entityType.trim().isEmpty())
                ? entityType.toUpperCase().trim()
                : "STUDENT";

        Page<DepartureHistory> page;
        if (query != null && !query.trim().isEmpty()) {
            page = historyRepository.searchByEntityType(type, query.trim(), pageable);
        } else {
            page = historyRepository.findByEntityTypeOrderByDepartureDateDesc(type, pageable);
        }
        return page.map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public DepartureHistoryResponse getHistoryById(Long id) {
        return historyRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new ResourceNotFoundException("History record not found with ID: " + id));
    }

    @Transactional
    public void recordStudentDeparture(Student student) {
        recordStudentDeparture(student, null);
    }

    @Transactional
    public void recordStudentDeparture(Student student, String exitReason) {
        String adminUser = getCurrentUsername();
        String classrooms = (student.getClassrooms() != null && !student.getClassrooms().isEmpty())
                ? student.getClassrooms().stream()
                    .map(c -> c.getName() + " (" + c.getSubject() + ")")
                    .collect(Collectors.joining(", "))
                : "None";

        String finalNotes = (exitReason != null && !exitReason.trim().isEmpty())
                ? exitReason.trim()
                : (student.getNotes() != null && !student.getNotes().isBlank() ? student.getNotes() : "Student left school / Removed by Admin");

        DepartureHistory record = DepartureHistory.builder()
                .entityType("STUDENT")
                .originalId(student.getId())
                .identifier(student.getRollNumber())
                .fullName(student.getFullName())
                .email(student.getContactEmail())
                .phone(student.getContactPhone())
                .departmentOrGrade(student.getGrade())
                .gender(student.getGender())
                .dateOfBirth(student.getDateOfBirth())
                .enrollmentOrJoiningDate(student.getEnrollmentDate())
                .departureDate(ZonedDateTime.now())
                .guardianInfo(student.getGuardianName() + (student.getGuardianPhone() != null ? " (" + student.getGuardianPhone() + ")" : ""))
                .address(student.getAddress())
                .notes(finalNotes)
                .previousClassrooms(classrooms.isBlank() ? "None" : classrooms)
                .deletedBy(adminUser)
                .build();

        historyRepository.save(record);
        log.info("Recorded student departure in past history: {} ({}) with reason: {}", student.getFullName(), student.getRollNumber(), finalNotes);
    }

    @Transactional
    public void recordTeacherDeparture(Teacher teacher) {
        recordTeacherDeparture(teacher, null);
    }

    @Transactional
    public void recordTeacherDeparture(Teacher teacher, String exitReason) {
        String adminUser = getCurrentUsername();
        String classrooms = (teacher.getClassrooms() != null && !teacher.getClassrooms().isEmpty())
                ? teacher.getClassrooms().stream()
                    .map(c -> c.getName() + " (" + c.getSubject() + ")")
                    .collect(Collectors.joining(", "))
                : "None";

        String finalNotes = (exitReason != null && !exitReason.trim().isEmpty())
                ? exitReason.trim()
                : "Teacher departed / Employment concluded";

        DepartureHistory record = DepartureHistory.builder()
                .entityType("TEACHER")
                .originalId(teacher.getId())
                .identifier(teacher.getEmployeeId())
                .fullName(teacher.getUser().getFullName())
                .email(teacher.getUser().getEmail())
                .phone(teacher.getPhone())
                .departmentOrGrade(teacher.getDepartment())
                .gender("N/A")
                .dateOfBirth(null)
                .enrollmentOrJoiningDate(teacher.getCreatedAt() != null ? teacher.getCreatedAt().toLocalDate() : null)
                .departureDate(ZonedDateTime.now())
                .guardianInfo("N/A")
                .address("N/A")
                .notes(finalNotes)
                .previousClassrooms(classrooms.isBlank() ? "None" : classrooms)
                .deletedBy(adminUser)
                .build();

        historyRepository.save(record);
        log.info("Recorded teacher departure in past history: {} ({}) with reason: {}", teacher.getUser().getFullName(), teacher.getEmployeeId(), finalNotes);
    }

    @Transactional(readOnly = true)
    public long getCount(String type) {
        return historyRepository.countByEntityType(type.toUpperCase().trim());
    }

    private String getCurrentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (auth != null && auth.getName() != null) ? auth.getName() : "admin";
    }

    public DepartureHistoryResponse mapToResponse(DepartureHistory h) {
        return new DepartureHistoryResponse(
                h.getId(),
                h.getEntityType(),
                h.getOriginalId(),
                h.getIdentifier(),
                h.getFullName(),
                h.getEmail(),
                h.getPhone(),
                h.getDepartmentOrGrade(),
                h.getGender(),
                h.getDateOfBirth(),
                h.getEnrollmentOrJoiningDate(),
                h.getDepartureDate(),
                h.getGuardianInfo(),
                h.getAddress(),
                h.getNotes(),
                h.getPreviousClassrooms(),
                h.getDeletedBy(),
                h.getCreatedAt()
        );
    }
}
