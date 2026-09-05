package com.campusconnect.service;

import com.campusconnect.dto.request.CreateEventRequest;
import com.campusconnect.dto.response.EventResponse;
import com.campusconnect.entity.Event;
import com.campusconnect.entity.User;
import com.campusconnect.exception.ResourceNotFoundException;
import com.campusconnect.repository.EventRepository;
import com.campusconnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CollegeEventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    private User getCollege(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("College not found"));
    }

    private void assertOwner(Event event, User college) {
        if (!event.getCollege().equalsIgnoreCase(college.getCollegeName())) {
            throw new AccessDeniedException("You can only manage your own events");
        }
    }

    @Transactional
    public EventResponse createEvent(CreateEventRequest req, String collegeEmail) {
        User college = getCollege(collegeEmail);

        Event event = buildEvent(req, college);

        // If parentEventId is set, this is a sub-event
        if (req.getParentEventId() != null) {
            Event parent = eventRepository.findById(req.getParentEventId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Parent event not found: " + req.getParentEventId()));
            assertOwner(parent, college);
            event.setParentEvent(parent);
        }

        Event saved = eventRepository.save(event);
        log.info("Event created by {}: {}", collegeEmail, saved.getTitle());
        return EventResponse.from(saved);
    }

    @Transactional
    public EventResponse updateEvent(Long eventId, CreateEventRequest req, String collegeEmail) {
        User college = getCollege(collegeEmail);
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found: " + eventId));
        assertOwner(event, college);

        event.setTitle(req.getTitle());
        event.setDescription(req.getDescription());
        event.setCategory(Event.Category.valueOf(req.getCategory().toUpperCase()));
        event.setTotalSeats(req.getTotalSeats());
        event.setPrice(req.getPrice());
        event.setStartTime(req.getStartTime());
        event.setEndTime(req.getEndTime());
        event.setDateTime(req.getStartTime());
        event.setVenue(req.getVenue());
        if (req.getPosterUrl() != null) event.setPosterUrl(req.getPosterUrl());

        return EventResponse.from(eventRepository.save(event));
    }

    @Transactional
    public void deleteEvent(Long eventId, String collegeEmail) {
        User college = getCollege(collegeEmail);
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found: " + eventId));
        assertOwner(event, college);
        eventRepository.delete(event);
        log.info("Event deleted by {}: {}", collegeEmail, eventId);
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getMyEvents(String collegeEmail) {
        User college = getCollege(collegeEmail);
        return eventRepository
                .findByCollegeIgnoreCase(college.getCollegeName(), Pageable.unpaged())
                .stream()
                .filter(e -> e.getParentEvent() == null) // top-level only
                .map(e -> {
                    EventResponse r = EventResponse.from(e);
                    return r;
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getSubEvents(Long parentId, String collegeEmail) {
        User college = getCollege(collegeEmail);
        Event parent = eventRepository.findById(parentId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found: " + parentId));
        assertOwner(parent, college);
        return parent.getSubEvents().stream()
                .map(EventResponse::from)
                .collect(Collectors.toList());
    }

    private Event buildEvent(CreateEventRequest req, User college) {
        Event event = new Event();
        event.setTitle(req.getTitle());
        event.setDescription(req.getDescription());
        event.setCollege(college.getCollegeName());
        event.setCategory(Event.Category.valueOf(req.getCategory().toUpperCase()));
        event.setTotalSeats(req.getTotalSeats());
        event.setAvailableSeats(req.getTotalSeats());
        event.setPrice(req.getPrice());
        event.setStartTime(req.getStartTime());
        event.setEndTime(req.getEndTime());
        event.setDateTime(req.getStartTime()); // keep backward compat
        event.setVenue(req.getVenue());
        event.setPosterUrl(req.getPosterUrl());
        return event;
    }
}
