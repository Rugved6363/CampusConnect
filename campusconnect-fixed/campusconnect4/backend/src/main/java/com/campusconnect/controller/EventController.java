package com.campusconnect.controller;

import com.campusconnect.dto.response.EventResponse;
import com.campusconnect.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping
    public ResponseEntity<Page<EventResponse>> getEvents(
            @RequestParam(required = false) String college,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "dateTime,asc") String sort) {

        return ResponseEntity.ok(eventService.getEvents(college, category, page, size, sort));
    }

    @GetMapping("/trending")
    public ResponseEntity<List<EventResponse>> getTrending() {
        return ResponseEntity.ok(eventService.getTrendingEvents());
    }

    @GetMapping("/colleges")
    public ResponseEntity<List<String>> getColleges() {
        return ResponseEntity.ok(eventService.getDistinctColleges());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventResponse> getEventById(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }
}
