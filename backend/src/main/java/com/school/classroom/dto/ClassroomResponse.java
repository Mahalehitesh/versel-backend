package com.school.classroom.dto;

import java.util.List;

public record ClassroomResponse(
    Long id,
    String name,
    String gradeSection,
    String subject,
    String roomNumber,
    TermResponse term,
    int teacherCount,
    int studentCount,
    List<TeacherResponse> teachers,
    List<StudentResponse> students
) {}
