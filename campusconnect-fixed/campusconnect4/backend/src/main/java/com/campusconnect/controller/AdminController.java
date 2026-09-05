package com.campusconnect.controller;

import com.campusconnect.dto.request.CreateCollegeRequest;
import com.campusconnect.dto.response.EventResponse;
import com.campusconnect.dto.response.UserSummaryResponse;
import com.campusconnect.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @PostMapping("/colleges")
    public ResponseEntity<UserSummaryResponse> createCollege(@Valid @RequestBody CreateCollegeRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(adminService.createCollege(req));
    }

    @GetMapping("/colleges")
    public ResponseEntity<List<UserSummaryResponse>> getColleges() {
        return ResponseEntity.ok(adminService.getAllColleges());
    }

    @DeleteMapping("/colleges/{id}")
    public ResponseEntity<Void> deleteCollege(@PathVariable Long id) {
        adminService.deleteCollege(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserSummaryResponse>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/events")
    public ResponseEntity<List<EventResponse>> getAllEvents() {
        return ResponseEntity.ok(adminService.getAllEvents());
    }

    @DeleteMapping("/events/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        adminService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        long students  = adminService.getAllUsers().stream().filter(u -> "STUDENT".equals(u.getRole())).count();
        long colleges  = adminService.getAllColleges().size();
        long events    = adminService.getAllEvents().stream().filter(e -> e.getParentEventId() == null).count();
        long subEvents = adminService.countSubEvents();
        return ResponseEntity.ok(Map.of(
                "students",  students,
                "colleges",  colleges,
                "events",    events,
                "subEvents", subEvents
        ));
    }

    @GetMapping("/search")
    public ResponseEntity<AdminService.AdminSearchResult> search(@RequestParam String q) {
        return ResponseEntity.ok(adminService.search(q));
    }
}
