package com.campusconnect.service;

import com.campusconnect.dto.response.EventResponse;
import com.campusconnect.entity.Event;
import com.campusconnect.exception.ResourceNotFoundException;
import com.campusconnect.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventService {

    private final EventRepository eventRepository;

    @Transactional(readOnly = true)
    public Page<EventResponse> getEvents(String college, String category, int page, int size, String sort) {
        Pageable pageable = buildPageable(page, size, sort);
        Page<Event> events;

        boolean hasCollege = StringUtils.hasText(college);
        boolean hasCategory = StringUtils.hasText(category);

        if (hasCollege && hasCategory) {
            Event.Category cat = parseCategory(category);
            events = eventRepository.findByCollegeIgnoreCaseAndCategory(college, cat, pageable);
        } else if (hasCollege) {
            events = eventRepository.findByCollegeIgnoreCase(college, pageable);
        } else if (hasCategory) {
            Event.Category cat = parseCategory(category);
            events = eventRepository.findByCategory(cat, pageable);
        } else {
            events = eventRepository.findAll(pageable);
        }

        return events.map(EventResponse::from);
    }

    @Transactional(readOnly = true)
    public EventResponse getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
        return EventResponse.from(event);
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getTrendingEvents() {
        Pageable top5 = PageRequest.of(0, 5);
        List<Event> trending = eventRepository.findTrendingEvents(
                java.time.LocalDateTime.now().minusDays(7), top5);

        // If not enough trending, fill with upcoming available
        if (trending.size() < 5) {
            List<Event> upcoming = eventRepository.findUpcomingAvailableEvents();
            for (Event e : upcoming) {
                if (trending.stream().noneMatch(t -> t.getId().equals(e.getId()))) {
                    trending.add(e);
                }
                if (trending.size() >= 5) break;
            }
        }

        return trending.stream().map(EventResponse::from).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<String> getDistinctColleges() {
        return eventRepository.findDistinctColleges();
    }

    private Pageable buildPageable(int page, int size, String sort) {
        Sort sortObj = Sort.by("dateTime").ascending();
        if (StringUtils.hasText(sort)) {
            String[] parts = sort.split(",");
            String field = parts[0].trim();
            Sort.Direction direction = parts.length > 1 && parts[1].trim().equalsIgnoreCase("desc")
                    ? Sort.Direction.DESC : Sort.Direction.ASC;
            sortObj = Sort.by(direction, field);
        }
        return PageRequest.of(page, Math.min(size, 50), sortObj);
    }

    private Event.Category parseCategory(String category) {
        try {
            return Event.Category.valueOf(category.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid category: " + category +
                    ". Valid values: CULTURAL, TECHNICAL, SPORTS, WORKSHOP");
        }
    }
}
