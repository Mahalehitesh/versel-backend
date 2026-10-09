package com.school.classroom;

import com.school.classroom.entity.Term;
import com.school.classroom.entity.TermStatus;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;

class TermServiceTest {

    @Test
    @DisplayName("Should return PAST status when current date is after end date")
    void testPastTermStatus() {
        Term term = Term.builder()
            .name("Fall 2024")
            .startDate(LocalDate.of(2024, 9, 1))
            .endDate(LocalDate.of(2024, 12, 20))
            .build();

        LocalDate checkDate = LocalDate.of(2025, 1, 15);
        assertEquals(TermStatus.PAST, term.getStatusForDate(checkDate));
    }

    @Test
    @DisplayName("Should return CURRENT status when current date is within start and end date")
    void testCurrentTermStatus() {
        Term term = Term.builder()
            .name("Spring 2026")
            .startDate(LocalDate.of(2026, 1, 15))
            .endDate(LocalDate.of(2026, 6, 15))
            .build();

        LocalDate checkDate = LocalDate.of(2026, 3, 10);
        assertEquals(TermStatus.CURRENT, term.getStatusForDate(checkDate));
    }

    @Test
    @DisplayName("Should return FUTURE status when current date is before start date")
    void testFutureTermStatus() {
        Term term = Term.builder()
            .name("Fall 2026")
            .startDate(LocalDate.of(2026, 9, 1))
            .endDate(LocalDate.of(2026, 12, 20))
            .build();

        LocalDate checkDate = LocalDate.of(2026, 5, 1);
        assertEquals(TermStatus.FUTURE, term.getStatusForDate(checkDate));
    }
}
