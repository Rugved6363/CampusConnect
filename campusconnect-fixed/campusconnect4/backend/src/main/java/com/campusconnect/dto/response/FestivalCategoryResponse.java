package com.campusconnect.dto.response;

import com.campusconnect.entity.FestivalCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class FestivalCategoryResponse {
    private Long id;
    private String name;
    private String description;
    private String icon;
    private Integer displayOrder;
    private List<SubEventResponse> subEvents;

    public static FestivalCategoryResponse from(FestivalCategory fc) {
        return FestivalCategoryResponse.builder()
                .id(fc.getId())
                .name(fc.getName())
                .description(fc.getDescription())
                .icon(fc.getIcon())
                .displayOrder(fc.getDisplayOrder())
                .subEvents(fc.getSubEvents().stream()
                        .map(SubEventResponse::from)
                        .collect(Collectors.toList()))
                .build();
    }
}
