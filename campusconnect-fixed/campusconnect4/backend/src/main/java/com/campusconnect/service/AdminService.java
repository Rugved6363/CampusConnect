package com.campusconnect.service;

import com.campusconnect.dto.request.CreateCollegeRequest;
import com.campusconnect.dto.response.EventResponse;
import com.campusconnect.dto.response.UserSummaryResponse;
import com.campusconnect.entity.User;
import com.campusconnect.exception.ResourceNotFoundException;
import com.campusconnect.repository.BookingRepository;
import com.campusconnect.repository.EventRepository;
import com.campusconnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminService {

    private final UserRepository  userRepository;
    private final EventRepository eventRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserSummaryResponse createCollege(CreateCollegeRequest req) {
        if (userRepository.existsByEmail(req.getEmail()))
            throw new IllegalArgumentException("Email already registered: " + req.getEmail());

        User college = new User();
        college.setName(req.getCollegeName());
        college.setEmail(req.getEmail());
        college.setPassword(passwordEncoder.encode(req.getPassword()));
        college.setRole(User.Role.COLLEGE);
        college.setCollegeName(req.getCollegeName());
        college.setApproved(true);

        User saved = userRepository.save(college);
        log.info("College account created: {}", saved.getEmail());
        return UserSummaryResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public List<UserSummaryResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserSummaryResponse::from).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UserSummaryResponse> getAllColleges() {
        return userRepository.findByRole(User.Role.COLLEGE).stream()
                .map(UserSummaryResponse::from).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(EventResponse::from).collect(Collectors.toList());
    }

    /** Count all sub-events (events with a parentEvent) */
    @Transactional(readOnly = true)
    public long countSubEvents() {
        return eventRepository.findAll().stream()
                .filter(e -> e.getParentEvent() != null 
                          || e.getFestivalCategory() != null)
                .count();}

    @Transactional
    public void deleteCollege(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("College not found: " + id));
        if (user.getRole() != User.Role.COLLEGE)
            throw new IllegalArgumentException("User is not a college account");
        userRepository.delete(user);
        log.info("College deleted: {}", id);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        if (user.getRole() == User.Role.ADMIN)
            throw new IllegalArgumentException("Cannot delete admin accounts");
        userRepository.delete(user);
        log.info("User deleted: {}", id);
    }

    @Transactional
    public void deleteEvent(Long id) {
        if (!eventRepository.existsById(id))
            throw new ResourceNotFoundException("Event not found: " + id);
        eventRepository.deleteById(id);
        log.info("Event deleted by admin: {}", id);
    }

    /** Search across users and events */
    @Transactional(readOnly = true)
    public AdminSearchResult search(String query) {
        String q = query.toLowerCase();
        AdminSearchResult result = new AdminSearchResult();

        result.users = userRepository.findAll().stream()
                .filter(u -> u.getName().toLowerCase().contains(q)
                        || u.getEmail().toLowerCase().contains(q))
                .map(UserSummaryResponse::from)
                .collect(Collectors.toList());

        result.events = eventRepository.findAll().stream()
                .filter(e -> e.getTitle().toLowerCase().contains(q)
                        || e.getCollege().toLowerCase().contains(q))
                .map(EventResponse::from)
                .collect(Collectors.toList());

        return result;
    }

    public static class AdminSearchResult {
        public List<UserSummaryResponse> users;
        public List<EventResponse> events;
    }
}
