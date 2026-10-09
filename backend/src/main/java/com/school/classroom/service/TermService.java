package com.school.classroom.service;

import com.school.classroom.dto.TermRequest;
import com.school.classroom.dto.TermResponse;
import com.school.classroom.entity.Term;
import com.school.classroom.exception.BadRequestException;
import com.school.classroom.exception.ResourceNotFoundException;
import com.school.classroom.repository.TermRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TermService {

    private final TermRepository termRepository;

    @Transactional(readOnly = true)
    public List<TermResponse> getAllTerms() {
        return termRepository.findAll().stream()
            .map(this::mapToTermResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public TermResponse getTermById(Long id) {
        Term term = termRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Term not found with ID: " + id));
        return mapToTermResponse(term);
    }

    @Transactional
    public TermResponse createTerm(TermRequest request) {
        if (request.startDate().isAfter(request.endDate())) {
            throw new BadRequestException("Start date cannot be after end date");
        }
        if (termRepository.existsByName(request.name())) {
            throw new BadRequestException("Term with name '" + request.name() + "' already exists");
        }

        Term term = Term.builder()
            .name(request.name())
            .startDate(request.startDate())
            .endDate(request.endDate())
            .build();

        Term savedTerm = termRepository.save(term);
        return mapToTermResponse(savedTerm);
    }

    @Transactional
    public TermResponse updateTerm(Long id, TermRequest request) {
        Term term = termRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Term not found with ID: " + id));

        if (request.startDate().isAfter(request.endDate())) {
            throw new BadRequestException("Start date cannot be after end date");
        }

        if (!term.getName().equals(request.name()) && termRepository.existsByName(request.name())) {
            throw new BadRequestException("Term with name '" + request.name() + "' already exists");
        }

        term.setName(request.name());
        term.setStartDate(request.startDate());
        term.setEndDate(request.endDate());

        Term updatedTerm = termRepository.save(term);
        return mapToTermResponse(updatedTerm);
    }

    @Transactional
    public void deleteTerm(Long id) {
        if (!termRepository.existsById(id)) {
            throw new ResourceNotFoundException("Term not found with ID: " + id);
        }
        termRepository.deleteById(id);
    }

    public TermResponse mapToTermResponse(Term term) {
        return new TermResponse(
            term.getId(),
            term.getName(),
            term.getStartDate(),
            term.getEndDate(),
            term.getStatusForDate(LocalDate.now())
        );
    }
}
