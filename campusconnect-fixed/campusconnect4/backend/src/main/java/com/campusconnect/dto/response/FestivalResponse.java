package com.campusconnect.dto.response;

import com.campusconnect.entity.Festival;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class FestivalResponse {
    private Long id;
    private String name;
    private String description;
    private String college;
    private String edition;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String venue;
    private String posterUrl;
    private String websiteUrl;
    // The main-pass event id — so frontend can link to /book/:mainEventId
    private Long mainEventId;
    private String mainEventTitle;
    private List<FestivalCategoryResponse> categories;

    public static FestivalResponse from(Festival f) {
        return FestivalResponse.builder()
                .id(f.getId())
                .name(f.getName())
                .description(f.getDescription())
                .college(f.getCollege())
                .edition(f.getEdition())
                .startDate(f.getStartDate())
                .endDate(f.getEndDate())
                .venue(f.getVenue())
                .posterUrl(f.getPosterUrl())
                .websiteUrl(f.getWebsiteUrl())
                .mainEventId(f.getMainEvent() != null ? f.getMainEvent().getId() : null)
                .mainEventTitle(f.getMainEvent() != null ? f.getMainEvent().getTitle() : null)
                .categories(f.getCategories().stream()
                        .map(FestivalCategoryResponse::from)
                        .collect(Collectors.toList()))
                .build();
    }
}
