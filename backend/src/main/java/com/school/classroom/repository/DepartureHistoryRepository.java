package com.school.classroom.repository;

import com.school.classroom.entity.DepartureHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DepartureHistoryRepository extends JpaRepository<DepartureHistory, Long> {

    List<DepartureHistory> findByEntityTypeOrderByDepartureDateDesc(String entityType);

    @Query("SELECT d FROM DepartureHistory d WHERE d.entityType = :entityType AND " +
           "(LOWER(d.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(d.identifier) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(d.departmentOrGrade) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "ORDER BY d.departureDate DESC")
    Page<DepartureHistory> searchByEntityType(
            @Param("entityType") String entityType,
            @Param("query") String query,
            Pageable pageable);

    Page<DepartureHistory> findByEntityTypeOrderByDepartureDateDesc(String entityType, Pageable pageable);

    long countByEntityType(String entityType);
}
