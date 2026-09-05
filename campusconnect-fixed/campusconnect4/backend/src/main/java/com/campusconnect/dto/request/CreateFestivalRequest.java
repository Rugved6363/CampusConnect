package com.campusconnect.dto.request;

import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

public class CreateFestivalRequest {

    @NotBlank(message = "Festival name is required")
    private String name;

    private String description;
    private String edition;       // e.g. "1st Edition"

    @NotNull(message = "Start date is required")
    private LocalDateTime startDate;

    @NotNull(message = "End date is required")
    private LocalDateTime endDate;

    private String venue;
    private String posterUrl;
    private String websiteUrl;

    // Main-pass ticket price (0 = free entry pass)
    private java.math.BigDecimal mainPassPrice = java.math.BigDecimal.ZERO;

    // Main-pass total seats
    @Min(value = 1, message = "At least 1 seat")
    private Integer mainPassSeats = 1000;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getEdition() { return edition; }
    public void setEdition(String edition) { this.edition = edition; }
    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }
    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }
    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }
    public String getPosterUrl() { return posterUrl; }
    public void setPosterUrl(String posterUrl) { this.posterUrl = posterUrl; }
    public String getWebsiteUrl() { return websiteUrl; }
    public void setWebsiteUrl(String websiteUrl) { this.websiteUrl = websiteUrl; }
    public java.math.BigDecimal getMainPassPrice() { return mainPassPrice; }
    public void setMainPassPrice(java.math.BigDecimal p) { this.mainPassPrice = p; }
    public Integer getMainPassSeats() { return mainPassSeats; }
    public void setMainPassSeats(Integer s) { this.mainPassSeats = s; }
}
