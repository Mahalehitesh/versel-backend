package com.school.classroom.repository;

import com.school.classroom.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByRollNumber(String rollNumber);
    Boolean existsByRollNumber(String rollNumber);

    @Query("""
        SELECT s FROM Student s
        JOIN s.classrooms c
        WHERE c.id = :classroomId
        AND (
            LOWER(s.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR
            LOWER(s.lastName) LIKE LOWER(CONCAT('%', :query, '%')) OR
            LOWER(s.rollNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR
            LOWER(s.grade) LIKE LOWER(CONCAT('%', :query, '%'))
        )
    """)
    Page<Student> findStudentsByClassroomIdAndQuery(
        @Param("classroomId") Long classroomId,
        @Param("query") String query,
        Pageable pageable
    );

    @Query("SELECT s FROM Student s JOIN s.classrooms c WHERE c.id = :classroomId")
    Page<Student> findStudentsByClassroomId(@Param("classroomId") Long classroomId, Pageable pageable);
}
