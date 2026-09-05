package com.campusconnect.dto.response;

import com.campusconnect.entity.Event;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class SubEventResponse {
    private Long id;
    private String title;
    private String description;
    private Integer totalSeats;
    private Integer availableSeats;
    private BigDecimal price;
    private LocalDateTime dateTime;
    private String venue;
    private String posterUrl;
    private boolean soldOut;
    private String category;

    public static SubEventResponse from(Event e) {
        return SubEventResponse.builder()
                .id(e.getId())
                .title(e.getTitle())
                .description(e.getDescription())
                .totalSeats(e.getTotalSeats())
                .availableSeats(e.getAvailableSeats())
                .price(e.getPrice())
                .dateTime(e.getDateTime())
                .venue(e.getVenue())
                .posterUrl(e.getPosterUrl())
                .soldOut(e.getAvailableSeats() == 0)
                .category(e.getCategory().name())
                .build();
    }
}
