package com.school.classroom.service;

import com.school.classroom.dto.TeacherRequest;
import com.school.classroom.dto.TeacherResponse;
import com.school.classroom.entity.Role;
import com.school.classroom.entity.Teacher;
import com.school.classroom.entity.User;
import com.school.classroom.exception.BadRequestException;
import com.school.classroom.exception.ResourceNotFoundException;
import com.school.classroom.repository.TeacherRepository;
import com.school.classroom.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeacherService {

    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public List<TeacherResponse> getAllTeachers() {
        return teacherRepository.findAll().stream()
            .map(this::mapToTeacherResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public TeacherResponse getTeacherById(Long id) {
        Teacher teacher = teacherRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with ID: " + id));
        return mapToTeacherResponse(teacher);
    }

    @Transactional
    public TeacherResponse createTeacher(TeacherRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new BadRequestException("Username '" + request.username() + "' is already taken");
        }
        if (userRepository.existsByEmail(request.email())) {
            throw new BadRequestException("Email '" + request.email() + "' is already registered");
        }
        if (teacherRepository.existsByEmployeeId(request.employeeId())) {
            throw new BadRequestException("Employee ID '" + request.employeeId() + "' already exists");
        }

        User user = User.builder()
            .username(request.username())
            .password(passwordEncoder.encode(request.password()))
            .email(request.email())
            .fullName(request.fullName())
            .role(Role.TEACHER)
            .build();

        User savedUser = userRepository.save(user);

        Teacher teacher = Teacher.builder()
            .user(savedUser)
            .employeeId(request.employeeId())
            .department(request.department())
            .phone(request.phone())
            .build();

        Teacher savedTeacher = teacherRepository.save(teacher);
        return mapToTeacherResponse(savedTeacher);
    }

    @Transactional
    public TeacherResponse updateTeacher(Long id, TeacherRequest request) {
        Teacher teacher = teacherRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with ID: " + id));

        User user = teacher.getUser();

        if (!user.getEmail().equals(request.email()) && userRepository.existsByEmail(request.email())) {
            throw new BadRequestException("Email '" + request.email() + "' is already registered");
        }

        if (!teacher.getEmployeeId().equals(request.employeeId()) && teacherRepository.existsByEmployeeId(request.employeeId())) {
            throw new BadRequestException("Employee ID '" + request.employeeId() + "' already exists");
        }

        user.setFullName(request.fullName());
        user.setEmail(request.email());
        if (request.password() != null && !request.password().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.password()));
        }
        userRepository.save(user);

        teacher.setEmployeeId(request.employeeId());
        teacher.setDepartment(request.department());
        teacher.setPhone(request.phone());

        Teacher updatedTeacher = teacherRepository.save(teacher);
        return mapToTeacherResponse(updatedTeacher);
    }

    @Transactional
    public void deleteTeacher(Long id) {
        Teacher teacher = teacherRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with ID: " + id));
        teacherRepository.delete(teacher);
    }

    public TeacherResponse mapToTeacherResponse(Teacher teacher) {
        User user = teacher.getUser();
        return new TeacherResponse(
            teacher.getId(),
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getFullName(),
            teacher.getEmployeeId(),
            teacher.getDepartment(),
            teacher.getPhone()
        );
    }
}
