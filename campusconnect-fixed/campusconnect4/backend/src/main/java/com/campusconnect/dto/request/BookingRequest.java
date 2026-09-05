package com.campusconnect.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BookingRequest {

    @NotNull(message = "Event ID is required")
    private Long eventId;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Minimum 1 ticket required")
    @Max(value = 5, message = "Maximum 5 tickets per booking")
    private Integer quantity;
}
