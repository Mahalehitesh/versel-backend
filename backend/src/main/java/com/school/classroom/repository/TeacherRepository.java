package com.school.classroom.repository;

import com.school.classroom.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    Optional<Teacher> findByUserId(Long userId);
    Optional<Teacher> findByUserUsername(String username);
    Boolean existsByEmployeeId(String employeeId);
}
