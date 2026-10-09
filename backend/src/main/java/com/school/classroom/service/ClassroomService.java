package com.school.classroom.service;

import com.school.classroom.dto.*;
import com.school.classroom.entity.Classroom;
import com.school.classroom.entity.Student;
import com.school.classroom.entity.Teacher;
import com.school.classroom.entity.Term;
import com.school.classroom.exception.ResourceNotFoundException;
import com.school.classroom.repository.ClassroomRepository;
import com.school.classroom.repository.StudentRepository;
import com.school.classroom.repository.TeacherRepository;
import com.school.classroom.repository.TermRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClassroomService {

    private final ClassroomRepository classroomRepository;
    private final TermRepository termRepository;
    private final TeacherRepository teacherRepository;
    private final StudentRepository studentRepository;
    private final TermService termService;
    private final TeacherService teacherService;
    private final StudentService studentService;

    @Transactional(readOnly = true)
    public List<ClassroomResponse> getAllClassrooms() {
        return classroomRepository.findAll().stream()
            .map(this::mapToClassroomResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public ClassroomResponse getClassroomById(Long id) {
        Classroom classroom = classroomRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Classroom not found with ID: " + id));
        return mapToClassroomResponse(classroom);
    }

    @Transactional
    public ClassroomResponse createClassroom(ClassroomRequest request) {
        Term term = termRepository.findById(request.termId())
            .orElseThrow(() -> new ResourceNotFoundException("Term not found with ID: " + request.termId()));

        Classroom classroom = Classroom.builder()
            .name(request.name())
            .gradeSection(request.gradeSection())
            .subject(request.subject())
            .roomNumber(request.roomNumber())
            .term(term)
            .build();

        Classroom saved = classroomRepository.save(classroom);
        return mapToClassroomResponse(saved);
    }

    @Transactional
    public ClassroomResponse updateClassroom(Long id, ClassroomRequest request) {
        Classroom classroom = classroomRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Classroom not found with ID: " + id));

        Term term = termRepository.findById(request.termId())
            .orElseThrow(() -> new ResourceNotFoundException("Term not found with ID: " + request.termId()));

        classroom.setName(request.name());
        classroom.setGradeSection(request.gradeSection());
        classroom.setSubject(request.subject());
        classroom.setRoomNumber(request.roomNumber());
        classroom.setTerm(term);

        Classroom updated = classroomRepository.save(classroom);
        return mapToClassroomResponse(updated);
    }

    @Transactional
    public void deleteClassroom(Long id) {
        if (!classroomRepository.existsById(id)) {
            throw new ResourceNotFoundException("Classroom not found with ID: " + id);
        }
        classroomRepository.deleteById(id);
    }

    @Transactional
    public ClassroomResponse assignTeachers(Long classroomId, Set<Long> teacherIds) {
        Classroom classroom = classroomRepository.findById(classroomId)
            .orElseThrow(() -> new ResourceNotFoundException("Classroom not found with ID: " + classroomId));

        List<Teacher> teachers = teacherRepository.findAllById(teacherIds);
        classroom.getTeachers().addAll(teachers);

        Classroom saved = classroomRepository.save(classroom);
        return mapToClassroomResponse(saved);
    }

    @Transactional
    public ClassroomResponse removeTeacher(Long classroomId, Long teacherId) {
        Classroom classroom = classroomRepository.findById(classroomId)
            .orElseThrow(() -> new ResourceNotFoundException("Classroom not found with ID: " + classroomId));

        Teacher teacher = teacherRepository.findById(teacherId)
            .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with ID: " + teacherId));

        classroom.getTeachers().remove(teacher);
        Classroom saved = classroomRepository.save(classroom);
        return mapToClassroomResponse(saved);
    }

    @Transactional
    public ClassroomResponse assignStudents(Long classroomId, Set<Long> studentIds) {
        Classroom classroom = classroomRepository.findById(classroomId)
            .orElseThrow(() -> new ResourceNotFoundException("Classroom not found with ID: " + classroomId));

        List<Student> students = studentRepository.findAllById(studentIds);
        classroom.getStudents().addAll(students);

        Classroom saved = classroomRepository.save(classroom);
        return mapToClassroomResponse(saved);
    }

    @Transactional
    public ClassroomResponse removeStudent(Long classroomId, Long studentId) {
        Classroom classroom = classroomRepository.findById(classroomId)
            .orElseThrow(() -> new ResourceNotFoundException("Classroom not found with ID: " + classroomId));

        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + studentId));

        classroom.getStudents().remove(student);
        Classroom saved = classroomRepository.save(classroom);
        return mapToClassroomResponse(saved);
    }

    @Transactional(readOnly = true)
    public Page<StudentResponse> getClassroomStudents(Long classroomId, String query, Pageable pageable) {
        if (!classroomRepository.existsById(classroomId)) {
            throw new ResourceNotFoundException("Classroom not found with ID: " + classroomId);
        }

        if (query != null && !query.trim().isEmpty()) {
            return studentRepository.findStudentsByClassroomIdAndQuery(classroomId, query.trim(), pageable)
                .map(studentService::mapToStudentResponse);
        } else {
            return studentRepository.findStudentsByClassroomId(classroomId, pageable)
                .map(studentService::mapToStudentResponse);
        }
    }

    public ClassroomResponse mapToClassroomResponse(Classroom classroom) {
        TermResponse termResp = termService.mapToTermResponse(classroom.getTerm());
        List<TeacherResponse> teachers = classroom.getTeachers().stream()
            .map(teacherService::mapToTeacherResponse)
            .collect(Collectors.toList());

        List<StudentResponse> students = classroom.getStudents().stream()
            .map(studentService::mapToStudentResponse)
            .collect(Collectors.toList());

        return new ClassroomResponse(
            classroom.getId(),
            classroom.getName(),
            classroom.getGradeSection(),
            classroom.getSubject(),
            classroom.getRoomNumber(),
            termResp,
            classroom.getTeachers().size(),
            classroom.getStudents().size(),
            teachers,
            students
        );
    }
}
