package com.campusconnect.dto.request;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CreateEventRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "Total seats required")
    @Min(value = 1, message = "At least 1 seat")
    private Integer totalSeats;

    @DecimalMin(value = "0.0", message = "Price cannot be negative")
    private BigDecimal price = BigDecimal.ZERO;

    @NotNull(message = "Start time is required")
    @Future(message = "Start time must be in the future")
    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private String venue;
    private String posterUrl;

    /** If set, this event is created as a sub-event of the given parent event id */
    private Long parentEventId;

    // kept for backward compat — maps to startTime if startTime is null
    private LocalDateTime dateTime;

    public String getTitle() { return title; }
    public void setTitle(String t) { this.title = t; }
    public String getDescription() { return description; }
    public void setDescription(String d) { this.description = d; }
    public String getCategory() { return category; }
    public void setCategory(String c) { this.category = c; }
    public Integer getTotalSeats() { return totalSeats; }
    public void setTotalSeats(Integer s) { this.totalSeats = s; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal p) { this.price = p; }
    public LocalDateTime getStartTime() { return startTime != null ? startTime : dateTime; }
    public void setStartTime(LocalDateTime t) { this.startTime = t; }
    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime t) { this.endTime = t; }
    public LocalDateTime getDateTime() { return startTime != null ? startTime : dateTime; }
    public void setDateTime(LocalDateTime t) { this.dateTime = t; }
    public String getVenue() { return venue; }
    public void setVenue(String v) { this.venue = v; }
    public String getPosterUrl() { return posterUrl; }
    public void setPosterUrl(String u) { this.posterUrl = u; }
    public Long getParentEventId() { return parentEventId; }
    public void setParentEventId(Long id) { this.parentEventId = id; }
}
