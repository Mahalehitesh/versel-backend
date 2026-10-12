package com.school.classroom.controller;

import com.school.classroom.dto.DepartureHistoryResponse;
import com.school.classroom.service.DepartureHistoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/history")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Departure History", description = "Audit log of departed students and teachers who left the school (Admin Only)")
public class DepartureHistoryController {

    private final DepartureHistoryService historyService;

    @GetMapping
    @Operation(summary = "Get paginated history of departed students or teachers with search")
    public ResponseEntity<Page<DepartureHistoryResponse>> getHistory(
            @RequestParam(defaultValue = "STUDENT") String type,
            @RequestParam(required = false) String query,
            @PageableDefault(size = 15) Pageable pageable) {
        return ResponseEntity.ok(historyService.getHistory(type, query, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get detail of a specific departure history record")
    public ResponseEntity<DepartureHistoryResponse> getHistoryById(@PathVariable Long id) {
        return ResponseEntity.ok(historyService.getHistoryById(id));
    }

    @GetMapping("/counts")
    @Operation(summary = "Get summary counts of departed students and teachers")
    public ResponseEntity<Map<String, Long>> getCounts() {
        return ResponseEntity.ok(Map.of(
                "students", historyService.getCount("STUDENT"),
                "teachers", historyService.getCount("TEACHER")
        ));
    }
}
