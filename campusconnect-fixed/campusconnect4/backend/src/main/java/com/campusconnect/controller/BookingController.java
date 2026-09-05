package com.campusconnect.controller;

import com.campusconnect.dto.request.BookingRequest;
import com.campusconnect.dto.response.BookingResponse;
import com.campusconnect.repository.UserRepository;
import com.campusconnect.security.JwtUtil;
import com.campusconnect.service.BookingService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @PostMapping("/api/bookings")
    public ResponseEntity<BookingResponse> createBooking(
            @Valid @RequestBody BookingRequest request,
            HttpServletRequest httpRequest) {

        Long userId = extractUserId(httpRequest);
        BookingResponse response = bookingService.bookTicket(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/api/users/{userId}/bookings")
    public ResponseEntity<List<BookingResponse>> getUserBookings(
            @PathVariable Long userId,
            HttpServletRequest httpRequest) {

        Long requestingUserId = extractUserId(httpRequest);

        // Users can only view their own bookings
        if (!requestingUserId.equals(userId)) {
            throw new AccessDeniedException("Access denied: You can only view your own bookings.");
        }

        return ResponseEntity.ok(bookingService.getUserBookings(userId));
    }

    @DeleteMapping("/api/bookings/{bookingId}")
    public ResponseEntity<Map<String, String>> cancelBooking(
            @PathVariable Long bookingId,
            HttpServletRequest httpRequest) {

        Long userId = extractUserId(httpRequest);
        Map<String, String> response = bookingService.cancelBooking(bookingId, userId);
        return ResponseEntity.ok(response);
    }

    private Long extractUserId(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (!StringUtils.hasText(authHeader) || !authHeader.startsWith("Bearer ")) {
            throw new AccessDeniedException("Missing or invalid Authorization header");
        }
        String token = authHeader.substring(7);
        return jwtUtil.extractUserId(token);
    }
}
