package com.campusconnect.dto.response;

import com.campusconnect.entity.User;
import java.time.LocalDateTime;

public class UserSummaryResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String collegeName;
    private boolean approved;
    private LocalDateTime createdAt;

    public static UserSummaryResponse from(User u) {
        UserSummaryResponse r = new UserSummaryResponse();
        r.id          = u.getId();
        r.name        = u.getName();
        r.email       = u.getEmail();
        r.role        = u.getRole().name();
        r.collegeName = u.getCollegeName();
        r.approved    = u.isApproved();
        r.createdAt   = u.getCreatedAt();
        return r;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public String getCollegeName() { return collegeName; }
    public boolean isApproved() { return approved; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
