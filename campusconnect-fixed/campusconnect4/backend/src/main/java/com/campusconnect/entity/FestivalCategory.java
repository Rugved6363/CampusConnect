package com.campusconnect.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * A named track/category within a festival.
 * e.g. "🎤 Pro Shows", "😂 Comedy & Celebrity", "💃 Performing Arts"
 */
@Entity
@Table(name = "festival_categories")
public class FestivalCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "festival_id", nullable = false)
    private Festival festival;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 10)
    private String icon;

    @Column(name = "display_order")
    private Integer displayOrder = 0;

    /** Sub-events belonging to this category — EAGER so they load with the category */
    @OneToMany(mappedBy = "festivalCategory", cascade = CascadeType.ALL,
               fetch = FetchType.EAGER, orphanRemoval = true)
    @OrderBy("dateTime ASC")
    private List<Event> subEvents = new ArrayList<>();

    public FestivalCategory() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Festival getFestival() { return festival; }
    public void setFestival(Festival festival) { this.festival = festival; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
    public List<Event> getSubEvents() { return subEvents; }
    public void setSubEvents(List<Event> subEvents) { this.subEvents = subEvents; }
}