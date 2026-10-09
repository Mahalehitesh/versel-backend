package com.school.classroom.service;

import com.school.classroom.dto.ClassroomResponse;
import com.school.classroom.dto.TeacherDashboardResponse;
import com.school.classroom.entity.Classroom;
import com.school.classroom.entity.TermStatus;
import com.school.classroom.repository.ClassroomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TeacherDashboardService {

    private final ClassroomRepository classroomRepository;
    private final ClassroomService classroomService;

    @Transactional(readOnly = true)
    public TeacherDashboardResponse getTeacherDashboard(String username) {
        List<Classroom> teacherClassrooms = classroomRepository.findAllByTeacherUsername(username);

        List<ClassroomResponse> currentTerm = new ArrayList<>();
        List<ClassroomResponse> previousTerm = new ArrayList<>();
        List<ClassroomResponse> futureTerm = new ArrayList<>();

        LocalDate now = LocalDate.now();

        for (Classroom classroom : teacherClassrooms) {
            TermStatus status = classroom.getTerm().getStatusForDate(now);
            ClassroomResponse response = classroomService.mapToClassroomResponse(classroom);

            switch (status) {
                case CURRENT -> currentTerm.add(response);
                case PAST -> previousTerm.add(response);
                case FUTURE -> futureTerm.add(response);
            }
        }

        return new TeacherDashboardResponse(currentTerm, previousTerm, futureTerm);
    }
}
