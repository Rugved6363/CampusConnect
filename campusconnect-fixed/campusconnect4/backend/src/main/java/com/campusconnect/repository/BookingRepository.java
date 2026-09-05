package com.campusconnect.repository;

import com.campusconnect.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserIdOrderByBookedAtDesc(Long userId);

    @Query("SELECT b FROM Booking b JOIN FETCH b.event WHERE b.id = :id")
    Optional<Booking> findByIdWithEvent(@Param("id") Long id);

    boolean existsByUserIdAndEventIdAndStatus(Long userId, Long eventId, Booking.BookingStatus status);
}
