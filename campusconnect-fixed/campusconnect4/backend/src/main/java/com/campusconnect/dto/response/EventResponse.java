package com.campusconnect.dto.response;

import com.campusconnect.entity.Event;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class EventResponse {
    private Long id;
    private String title;
    private String description;
    private String college;
    private String category;
    private Integer totalSeats;
    private Integer availableSeats;
    private BigDecimal price;
    private LocalDateTime dateTime;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String venue;
    private String posterUrl;
    private boolean soldOut;
    private Long parentEventId;
    private List<EventResponse> subEvents;

    public static EventResponse from(Event event) {
        EventResponse r = new EventResponse();
        r.id             = event.getId();
        r.title          = event.getTitle();
        r.description    = event.getDescription();
        r.college        = event.getCollege();
        r.category       = event.getCategory().name();
        r.totalSeats     = event.getTotalSeats();
        r.availableSeats = event.getAvailableSeats();
        r.price          = event.getPrice();
        r.dateTime       = event.getStartTime() != null ? event.getStartTime() : event.getDateTime();
        r.startTime      = event.getStartTime();
        r.endTime        = event.getEndTime();
        r.venue          = event.getVenue();
        r.posterUrl      = event.getPosterUrl();
        r.soldOut        = event.getAvailableSeats() == 0;
        r.parentEventId  = event.getParentEvent() != null ? event.getParentEvent().getId() : null;
        if (event.getSubEvents() != null && !event.getSubEvents().isEmpty()) {
            r.subEvents = event.getSubEvents().stream()
                    .map(EventResponse::from).collect(Collectors.toList());
        }
        return r;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getCollege() { return college; }
    public String getCategory() { return category; }
    public Integer getTotalSeats() { return totalSeats; }
    public Integer getAvailableSeats() { return availableSeats; }
    public BigDecimal getPrice() { return price; }
    public LocalDateTime getDateTime() { return dateTime; }
    public LocalDateTime getStartTime() { return startTime; }
    public LocalDateTime getEndTime() { return endTime; }
    public String getVenue() { return venue; }
    public String getPosterUrl() { return posterUrl; }
    public boolean isSoldOut() { return soldOut; }
    public Long getParentEventId() { return parentEventId; }
    public List<EventResponse> getSubEvents() { return subEvents; }
}
