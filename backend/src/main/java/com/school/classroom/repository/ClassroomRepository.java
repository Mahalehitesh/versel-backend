package com.school.classroom.repository;

import com.school.classroom.entity.Classroom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClassroomRepository extends JpaRepository<Classroom, Long> {

    @Query("SELECT c FROM Classroom c JOIN c.teachers t WHERE t.user.username = :username")
    List<Classroom> findAllByTeacherUsername(@Param("username") String username);

    @Query("SELECT c FROM Classroom c JOIN c.teachers t WHERE t.id = :teacherId")
    List<Classroom> findAllByTeacherId(@Param("teacherId") Long teacherId);

    @Query("SELECT COUNT(c) > 0 FROM Classroom c JOIN c.teachers t WHERE c.id = :classroomId AND t.user.username = :username")
    boolean isTeacherAssignedToClassroom(@Param("classroomId") Long classroomId, @Param("username") String username);

    @Query("SELECT COUNT(s) > 0 FROM Classroom c JOIN c.teachers t JOIN c.students s WHERE s.id = :studentId AND t.user.username = :username")
    boolean isTeacherAssignedToStudent(@Param("studentId") Long studentId, @Param("username") String username);
}
