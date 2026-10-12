package com.school.classroom.service;

import com.school.classroom.dto.ClassroomSummaryDto;
import com.school.classroom.dto.StudentDetailResponse;
import com.school.classroom.dto.StudentRequest;
import com.school.classroom.dto.StudentResponse;
import com.school.classroom.entity.Classroom;
import com.school.classroom.entity.Student;
import com.school.classroom.exception.BadRequestException;
import com.school.classroom.exception.ResourceNotFoundException;
import com.school.classroom.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final DepartureHistoryService departureHistoryService;

    @Transactional(readOnly = true)
    public Page<StudentResponse> getAllStudents(Pageable pageable) {
        return studentRepository.findAll(pageable).map(this::mapToStudentResponse);
    }

    @Transactional(readOnly = true)
    public List<StudentResponse> getAllStudentsList() {
        return studentRepository.findAll().stream().map(this::mapToStudentResponse).toList();
    }

    @Transactional(readOnly = true)
    public StudentResponse getStudentById(Long id) {
        Student student = studentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));
        return mapToStudentResponse(student);
    }

    @Transactional(readOnly = true)
    public StudentDetailResponse getStudentDetailById(Long id) {
        Student student = studentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));

        List<ClassroomSummaryDto> classroomSummaries = student.getClassrooms().stream()
            .map(c -> new ClassroomSummaryDto(
                c.getId(),
                c.getName(),
                c.getGradeSection(),
                c.getSubject(),
                c.getRoomNumber(),
                c.getTerm().getName(),
                c.getTerm().getStatusForDate(LocalDate.now()).name()
            )).toList();

        return new StudentDetailResponse(
            student.getId(),
            student.getRollNumber(),
            student.getFirstName(),
            student.getLastName(),
            student.getFullName(),
            student.getDateOfBirth(),
            student.getGender(),
            student.getGrade(),
            student.getContactEmail(),
            student.getContactPhone(),
            student.getGuardianName(),
            student.getGuardianPhone(),
            student.getAddress(),
            student.getEnrollmentDate(),
            student.getNotes(),
            classroomSummaries
        );
    }

    @Transactional
    public StudentResponse createStudent(StudentRequest request) {
        if (studentRepository.existsByRollNumber(request.rollNumber())) {
            throw new BadRequestException("Roll number '" + request.rollNumber() + "' already exists");
        }

        Student student = Student.builder()
            .rollNumber(request.rollNumber())
            .firstName(request.firstName())
            .lastName(request.lastName())
            .dateOfBirth(request.dateOfBirth())
            .gender(request.gender())
            .grade(request.grade())
            .contactEmail(request.contactEmail())
            .contactPhone(request.contactPhone())
            .guardianName(request.guardianName())
            .guardianPhone(request.guardianPhone())
            .address(request.address())
            .enrollmentDate(request.enrollmentDate())
            .notes(request.notes())
            .build();

        Student savedStudent = studentRepository.save(student);
        return mapToStudentResponse(savedStudent);
    }

    @Transactional
    public StudentResponse updateStudent(Long id, StudentRequest request) {
        Student student = studentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));

        if (!student.getRollNumber().equals(request.rollNumber()) && studentRepository.existsByRollNumber(request.rollNumber())) {
            throw new BadRequestException("Roll number '" + request.rollNumber() + "' already exists");
        }

        student.setRollNumber(request.rollNumber());
        student.setFirstName(request.firstName());
        student.setLastName(request.lastName());
        student.setDateOfBirth(request.dateOfBirth());
        student.setGender(request.gender());
        student.setGrade(request.grade());
        student.setContactEmail(request.contactEmail());
        student.setContactPhone(request.contactPhone());
        student.setGuardianName(request.guardianName());
        student.setGuardianPhone(request.guardianPhone());
        student.setAddress(request.address());
        student.setEnrollmentDate(request.enrollmentDate());
        student.setNotes(request.notes());

        Student updatedStudent = studentRepository.save(student);
        return mapToStudentResponse(updatedStudent);
    }

    @Transactional
    public void deleteStudent(Long id) {
        deleteStudent(id, null);
    }

    @Transactional
    public void deleteStudent(Long id, String reason) {
        Student student = studentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));

        departureHistoryService.recordStudentDeparture(student, reason);

        if (student.getClassrooms() != null) {
            for (Classroom classroom : student.getClassrooms()) {
                classroom.getStudents().remove(student);
            }
        }
        studentRepository.delete(student);
    }

    public StudentResponse mapToStudentResponse(Student student) {
        return new StudentResponse(
            student.getId(),
            student.getRollNumber(),
            student.getFirstName(),
            student.getLastName(),
            student.getFullName(),
            student.getDateOfBirth(),
            student.getGender(),
            student.getGrade(),
            student.getContactEmail(),
            student.getContactPhone(),
            student.getGuardianName(),
            student.getGuardianPhone(),
            student.getAddress(),
            student.getEnrollmentDate(),
            student.getNotes()
        );
    }
}
