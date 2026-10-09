package com.school.classroom.dto;

import java.util.List;

public record TeacherDashboardResponse(
    List<ClassroomResponse> currentTermClassrooms,
    List<ClassroomResponse> previousTermClassrooms,
    List<ClassroomResponse> futureTermClassrooms
) {}
