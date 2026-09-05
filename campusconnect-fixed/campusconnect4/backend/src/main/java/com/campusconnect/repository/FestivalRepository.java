package com.campusconnect.repository;

import com.campusconnect.entity.Festival;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FestivalRepository extends JpaRepository<Festival, Long> {

    @Query("SELECT DISTINCT f FROM Festival f LEFT JOIN FETCH f.categories WHERE f.id = :id")
    Optional<Festival> findByIdWithDetails(@Param("id") Long id);

    @Query("SELECT f FROM Festival f LEFT JOIN FETCH f.mainEvent ORDER BY f.startDate ASC")
    List<Festival> findAllWithMainEvent();

    @Query("SELECT f FROM Festival f WHERE f.mainEvent.id = :eventId")
    Optional<Festival> findByMainEventId(@Param("eventId") Long eventId);
}