package com.school.classroom.repository;

import com.school.classroom.entity.Term;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TermRepository extends JpaRepository<Term, Long> {
    Optional<Term> findByName(String name);
    Boolean existsByName(String name);
}
