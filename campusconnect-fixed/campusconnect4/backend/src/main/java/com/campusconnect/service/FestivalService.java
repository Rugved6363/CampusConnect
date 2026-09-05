package com.campusconnect.service;

import com.campusconnect.dto.request.CreateCategoryRequest;
import com.campusconnect.dto.request.CreateEventRequest;
import com.campusconnect.dto.request.CreateFestivalRequest;
import com.campusconnect.dto.response.FestivalCategoryResponse;
import com.campusconnect.dto.response.FestivalResponse;
import com.campusconnect.entity.*;
import com.campusconnect.exception.ResourceNotFoundException;
import com.campusconnect.repository.EventRepository;
import com.campusconnect.repository.FestivalRepository;
import com.campusconnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FestivalService {

    private final FestivalRepository festivalRepository;
    private final EventRepository    eventRepository;
    private final UserRepository     userRepository;

    @Transactional(readOnly = true)
    public List<FestivalResponse> getAllFestivals() {
        return festivalRepository.findAllWithMainEvent()
                .stream().map(FestivalResponse::from).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public FestivalResponse getFestivalById(Long id) {
        // Step 1: load festival + categories in one query
        Festival festival = festivalRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Festival not found: " + id));
        // Step 2: force-load subEvents for each category (separate SELECT per category)
        // This avoids MultipleBagFetchException from joining two collections at once
        festival.getCategories().forEach(cat -> cat.getSubEvents().size());
        return FestivalResponse.from(festival);
    }

    @Transactional(readOnly = true)
    public FestivalResponse getFestivalByMainEventId(Long eventId) {
        return festivalRepository.findByMainEventId(eventId)
                .map(FestivalResponse::from).orElse(null);
    }

    @Transactional
    public FestivalResponse createFestival(CreateFestivalRequest req, String collegeEmail) {
        User college = getCollege(collegeEmail);

        Event mainPass = new Event();
        mainPass.setTitle(req.getName() + " — Main Pass");
        mainPass.setDescription("Main festival pass for " + req.getName() +
                ". Required for campus entry. Individual sub-events booked separately.");
        mainPass.setCollege(college.getCollegeName());
        mainPass.setCategory(Event.Category.CULTURAL);
        mainPass.setTotalSeats(req.getMainPassSeats());
        mainPass.setAvailableSeats(req.getMainPassSeats());
        mainPass.setPrice(req.getMainPassPrice());
        mainPass.setStartTime(req.getStartDate());
        mainPass.setEndTime(req.getEndDate());
        mainPass.setDateTime(req.getStartDate());
        mainPass.setVenue(req.getVenue());
        mainPass.setPosterUrl(req.getPosterUrl());
        Event savedPass = eventRepository.save(mainPass);

        Festival festival = new Festival();
        festival.setName(req.getName());
        festival.setDescription(req.getDescription());
        festival.setCollege(college.getCollegeName());
        festival.setEdition(req.getEdition());
        festival.setStartDate(req.getStartDate());
        festival.setEndDate(req.getEndDate());
        festival.setVenue(req.getVenue());
        festival.setPosterUrl(req.getPosterUrl());
        festival.setWebsiteUrl(req.getWebsiteUrl());
        festival.setMainEvent(savedPass);

        Festival saved = festivalRepository.save(festival);
        log.info("Festival created by {}: {}", collegeEmail, saved.getName());
        return FestivalResponse.from(saved);
    }

    @Transactional
    public FestivalCategoryResponse addCategory(Long festivalId, CreateCategoryRequest req, String collegeEmail) {
        Festival festival = assertFestivalOwner(festivalId, collegeEmail);

        FestivalCategory cat = new FestivalCategory();
        cat.setFestival(festival);
        cat.setName(req.getName());
        cat.setDescription(req.getDescription());
        cat.setIcon(req.getIcon() != null ? req.getIcon() : "🎪");
        cat.setDisplayOrder(festival.getCategories().size());
        festival.getCategories().add(cat);

        Festival saved = festivalRepository.save(festival);
        FestivalCategory savedCat = saved.getCategories()
                .get(saved.getCategories().size() - 1);
        return FestivalCategoryResponse.from(savedCat);
    }

    @Transactional
    public FestivalResponse addSubEvent(Long festivalId, Long categoryId,
                                        CreateEventRequest req, String collegeEmail) {
        User college = getCollege(collegeEmail);
        Festival festival = assertFestivalOwner(festivalId, collegeEmail);

        FestivalCategory cat = festival.getCategories().stream()
                .filter(c -> c.getId().equals(categoryId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + categoryId));

        Event sub = new Event();
        sub.setTitle(req.getTitle());
        sub.setDescription(req.getDescription());
        sub.setCollege(college.getCollegeName());
        sub.setCategory(Event.Category.valueOf(req.getCategory().toUpperCase()));
        sub.setTotalSeats(req.getTotalSeats());
        sub.setAvailableSeats(req.getTotalSeats());
        sub.setPrice(req.getPrice());
        sub.setStartTime(req.getStartTime());
        sub.setEndTime(req.getEndTime());
        sub.setDateTime(req.getStartTime());
        sub.setVenue(req.getVenue() != null ? req.getVenue() : festival.getVenue());
        sub.setPosterUrl(req.getPosterUrl() != null ? req.getPosterUrl() : festival.getPosterUrl());
        sub.setFestivalCategory(cat);
        eventRepository.save(sub);

        log.info("Sub-event '{}' added to festival '{}'", sub.getTitle(), festival.getName());
        return getFestivalById(festivalId);
    }

    @Transactional
    public void deleteCategory(Long festivalId, Long categoryId, String collegeEmail) {
        Festival festival = assertFestivalOwner(festivalId, collegeEmail);
        festival.getCategories().removeIf(c -> c.getId().equals(categoryId));
        festivalRepository.save(festival);
    }

    @Transactional
    public void deleteFestival(Long festivalId, String collegeEmail) {
        assertFestivalOwner(festivalId, collegeEmail);
        festivalRepository.deleteById(festivalId);
        log.info("Festival {} deleted by {}", festivalId, collegeEmail);
    }

    @Transactional(readOnly = true)
    public List<FestivalResponse> getMyFestivals(String collegeEmail) {
        User college = getCollege(collegeEmail);
        return festivalRepository.findAllWithMainEvent().stream()
                .filter(f -> f.getCollege().equalsIgnoreCase(college.getCollegeName()))
                .map(FestivalResponse::from)
                .collect(Collectors.toList());
    }

    private User getCollege(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("College not found"));
    }

    private Festival assertFestivalOwner(Long festivalId, String collegeEmail) {
        User college = getCollege(collegeEmail);
        Festival festival = festivalRepository.findById(festivalId)
                .orElseThrow(() -> new ResourceNotFoundException("Festival not found: " + festivalId));
        festival.getCategories().size();
        if (!festival.getCollege().equalsIgnoreCase(college.getCollegeName())) {
            throw new AccessDeniedException("You can only manage your own festivals");
        }
        return festival;
    }
}