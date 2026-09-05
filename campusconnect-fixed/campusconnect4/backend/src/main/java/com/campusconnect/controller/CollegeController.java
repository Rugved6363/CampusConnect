package com.campusconnect.controller;

import com.campusconnect.dto.request.CreateEventRequest;
import com.campusconnect.dto.response.EventResponse;
import com.campusconnect.service.CollegeEventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/college")
@RequiredArgsConstructor
@PreAuthorize("hasRole('COLLEGE')")
public class CollegeController {

    private final CollegeEventService collegeEventService;

    @GetMapping("/events")
    public ResponseEntity<List<EventResponse>> getMyEvents(@AuthenticationPrincipal UserDetails p) {
        return ResponseEntity.ok(collegeEventService.getMyEvents(p.getUsername()));
    }

    @PostMapping("/events")
    public ResponseEntity<EventResponse> createEvent(
            @Valid @RequestBody CreateEventRequest req,
            @AuthenticationPrincipal UserDetails p) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(collegeEventService.createEvent(req, p.getUsername()));
    }

    @PutMapping("/events/{id}")
    public ResponseEntity<EventResponse> updateEvent(
            @PathVariable Long id,
            @Valid @RequestBody CreateEventRequest req,
            @AuthenticationPrincipal UserDetails p) {
        return ResponseEntity.ok(collegeEventService.updateEvent(id, req, p.getUsername()));
    }

    @DeleteMapping("/events/{id}")
    public ResponseEntity<Void> deleteEvent(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails p) {
        collegeEventService.deleteEvent(id, p.getUsername());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/events/{id}/sub-events")
    public ResponseEntity<List<EventResponse>> getSubEvents(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails p) {
        return ResponseEntity.ok(collegeEventService.getSubEvents(id, p.getUsername()));
    }

    @PostMapping("/events/{parentId}/sub-events")
    public ResponseEntity<EventResponse> createSubEvent(
            @PathVariable Long parentId,
            @Valid @RequestBody CreateEventRequest req,
            @AuthenticationPrincipal UserDetails p) {
        req.setParentEventId(parentId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(collegeEventService.createEvent(req, p.getUsername()));
    }
}
