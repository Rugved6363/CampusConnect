package com.campusconnect.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Top-level festival (e.g. "Mood Indigo 2025").
 * The festival itself maps 1-to-1 with an existing Event row for
 * main-pass booking; sub-events are also separate Event rows.
 */
@Entity
@Table(name = "festivals")
public class Festival {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** The existing Event that represents the festival main pass (kept untouched) */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "main_event_id", unique = true)
    private Event mainEvent;

    @Column(nullable = false, length = 200)
    private String name;          // "Mood Indigo 2025"

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 150)
    private String college;       // "IIT Bombay"

    @Column(name = "edition", length = 80)
    private String edition;       // "52nd Edition"

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

    @Column(length = 200)
    private String venue;

    @Column(name = "poster_url", length = 500)
    private String posterUrl;

    @Column(name = "website_url", length = 500)
    private String websiteUrl;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "festival", cascade = CascadeType.ALL,
               fetch = FetchType.LAZY, orphanRemoval = true)
    @OrderBy("displayOrder ASC")
    private List<FestivalCategory> categories = new ArrayList<>();

    public Festival() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Event getMainEvent() { return mainEvent; }
    public void setMainEvent(Event mainEvent) { this.mainEvent = mainEvent; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCollege() { return college; }
    public void setCollege(String college) { this.college = college; }
    public String getEdition() { return edition; }
    public void setEdition(String edition) { this.edition = edition; }
    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime s) { this.startDate = s; }
    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime e) { this.endDate = e; }
    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }
    public String getPosterUrl() { return posterUrl; }
    public void setPosterUrl(String url) { this.posterUrl = url; }
    public String getWebsiteUrl() { return websiteUrl; }
    public void setWebsiteUrl(String url) { this.websiteUrl = url; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime t) { this.createdAt = t; }
    public List<FestivalCategory> getCategories() { return categories; }
    public void setCategories(List<FestivalCategory> c) { this.categories = c; }
}
