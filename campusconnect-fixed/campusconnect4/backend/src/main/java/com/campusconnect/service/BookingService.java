package com.campusconnect.service;

import com.campusconnect.dto.request.BookingRequest;
import com.campusconnect.dto.response.BookingResponse;
import com.campusconnect.entity.Booking;
import com.campusconnect.entity.Event;
import com.campusconnect.entity.User;
import com.campusconnect.exception.InsufficientSeatsException;
import com.campusconnect.exception.ResourceNotFoundException;
import com.campusconnect.repository.BookingRepository;
import com.campusconnect.repository.EventRepository;
import com.campusconnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingService {

    private final BookingRepository bookingRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public BookingResponse bookTicket(BookingRequest request, Long userId) {
        // Load user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Pessimistic lock prevents race conditions on concurrent bookings
        Event event = eventRepository.findByIdWithLock(request.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + request.getEventId()));

        // Validate seat availability
        if (event.getAvailableSeats() < request.getQuantity()) {
            if (event.getAvailableSeats() == 0) {
                throw new InsufficientSeatsException("This event is sold out.");
            }
            throw new InsufficientSeatsException(
                    "Only " + event.getAvailableSeats() + " seat(s) remaining for this event.");
        }

        // Decrement seats atomically within this transaction
        event.setAvailableSeats(event.getAvailableSeats() - request.getQuantity());
        eventRepository.save(event);

        // Persist booking
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setEvent(event);
        booking.setQuantity(request.getQuantity());
        booking.setStatus(Booking.BookingStatus.CONFIRMED);
        booking.setPaymentRef(generatePaymentRef());

        Booking saved = bookingRepository.save(booking);
        log.info("Booking confirmed: id={}, user={}, event={}, qty={}",
                saved.getId(), userId, event.getId(), request.getQuantity());

        // Broadcast real-time seat update to all connected WebSocket clients
        notificationService.broadcastSeatUpdate(event);

        return BookingResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getUserBookings(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        return bookingRepository.findByUserIdOrderByBookedAtDesc(userId)
                .stream()
                .map(BookingResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public Map<String, String> cancelBooking(Long bookingId, Long userId) {
        Booking booking = bookingRepository.findByIdWithEvent(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        // Authorization check: user can only cancel their own bookings
        if (!booking.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("You are not authorized to cancel this booking.");
        }

        if (booking.getStatus() == Booking.BookingStatus.CANCELLED) {
            throw new IllegalArgumentException("This booking is already cancelled.");
        }

        // Cancel booking and restore seats (pessimistic lock)
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        bookingRepository.save(booking);

        Event event = eventRepository.findByIdWithLock(booking.getEvent().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        event.setAvailableSeats(event.getAvailableSeats() + booking.getQuantity());
        eventRepository.save(event);

        // Broadcast updated seat count
        notificationService.broadcastSeatUpdate(event);

        log.info("Booking cancelled: id={}, refund issued", bookingId);

        return Map.of(
                "message", "Booking cancelled successfully.",
                "refundRef", "REFUND-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase()
        );
    }

    private String generatePaymentRef() {
        return "SIM-PAY-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
