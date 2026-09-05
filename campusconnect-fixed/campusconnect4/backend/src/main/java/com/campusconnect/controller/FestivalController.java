package com.campusconnect.controller;

import com.campusconnect.dto.request.CreateCategoryRequest;
import com.campusconnect.dto.request.CreateEventRequest;
import com.campusconnect.dto.request.CreateFestivalRequest;
import com.campusconnect.dto.response.FestivalCategoryResponse;
import com.campusconnect.dto.response.FestivalResponse;
import com.campusconnect.service.FestivalService;
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
@RequestMapping("/api/festivals")
@RequiredArgsConstructor
public class FestivalController {

    private final FestivalService festivalService;

    // ── Public (students) ──────────────────────────────
    @GetMapping
    public ResponseEntity<List<FestivalResponse>> getAllFestivals() {
        return ResponseEntity.ok(festivalService.getAllFestivals());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FestivalResponse> getFestival(@PathVariable Long id) {
        return ResponseEntity.ok(festivalService.getFestivalById(id));
    }

    @GetMapping("/by-event/{eventId}")
    public ResponseEntity<FestivalResponse> getFestivalByEvent(@PathVariable Long eventId) {
        FestivalResponse res = festivalService.getFestivalByMainEventId(eventId);
        return res != null ? ResponseEntity.ok(res) : ResponseEntity.noContent().build();
    }

    // ── College (authenticated) ────────────────────────
    @GetMapping("/my")
    @PreAuthorize("hasRole('COLLEGE')")
    public ResponseEntity<List<FestivalResponse>> getMyFestivals(
            @AuthenticationPrincipal UserDetails p) {
        return ResponseEntity.ok(festivalService.getMyFestivals(p.getUsername()));
    }

    @PostMapping
    @PreAuthorize("hasRole('COLLEGE')")
    public ResponseEntity<FestivalResponse> createFestival(
            @Valid @RequestBody CreateFestivalRequest req,
            @AuthenticationPrincipal UserDetails p) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(festivalService.createFestival(req, p.getUsername()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('COLLEGE')")
    public ResponseEntity<Void> deleteFestival(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails p) {
        festivalService.deleteFestival(id, p.getUsername());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{festivalId}/categories")
    @PreAuthorize("hasRole('COLLEGE')")
    public ResponseEntity<FestivalCategoryResponse> addCategory(
            @PathVariable Long festivalId,
            @Valid @RequestBody CreateCategoryRequest req,
            @AuthenticationPrincipal UserDetails p) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(festivalService.addCategory(festivalId, req, p.getUsername()));
    }

    @DeleteMapping("/{festivalId}/categories/{categoryId}")
    @PreAuthorize("hasRole('COLLEGE')")
    public ResponseEntity<Void> deleteCategory(
            @PathVariable Long festivalId,
            @PathVariable Long categoryId,
            @AuthenticationPrincipal UserDetails p) {
        festivalService.deleteCategory(festivalId, categoryId, p.getUsername());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{festivalId}/categories/{categoryId}/sub-events")
    @PreAuthorize("hasRole('COLLEGE')")
    public ResponseEntity<FestivalResponse> addSubEvent(
            @PathVariable Long festivalId,
            @PathVariable Long categoryId,
            @Valid @RequestBody CreateEventRequest req,
            @AuthenticationPrincipal UserDetails p) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(festivalService.addSubEvent(festivalId, categoryId, req, p.getUsername()));
    }
}
