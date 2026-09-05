package com.campusconnect.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeatUpdatePayload {
    private Long eventId;
    private Integer availableSeats;
    private boolean soldOut;
}
