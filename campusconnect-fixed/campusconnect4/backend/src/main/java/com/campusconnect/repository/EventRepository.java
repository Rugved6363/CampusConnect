package com.campusconnect.repository;

import com.campusconnect.entity.Event;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    // Pessimistic write lock — prevents concurrent seat overselling
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT e FROM Event e WHERE e.id = :id")
    Optional<Event> findByIdWithLock(@Param("id") Long id);

    // Filtered queries
    Page<Event> findByCollegeIgnoreCase(String college, Pageable pageable);

    Page<Event> findByCategory(Event.Category category, Pageable pageable);

    Page<Event> findByCollegeIgnoreCaseAndCategory(String college, Event.Category category, Pageable pageable);

    @Query("SELECT e FROM Event e WHERE e.availableSeats > 0 ORDER BY e.dateTime ASC")
    List<Event> findUpcomingAvailableEvents();

    // Trending: most bookings in last 7 days — pass the cutoff as a parameter to avoid
    // Hibernate 6's rejection of "CURRENT_TIMESTAMP - integer" arithmetic
    @Query("""
        SELECT e FROM Event e
        LEFT JOIN e.bookings b
        WHERE b.bookedAt >= :since
        GROUP BY e.id
        ORDER BY COUNT(b.id) DESC
        """)
    List<Event> findTrendingEvents(@Param("since") LocalDateTime since, Pageable pageable);

    // Distinct colleges for filter bar
    @Query("SELECT DISTINCT e.college FROM Event e ORDER BY e.college")
    List<String> findDistinctColleges();
}
