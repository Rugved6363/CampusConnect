package com.campusconnect.dto.response;

import com.campusconnect.entity.Booking;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private Long bookingId;
    private String eventTitle;
    private String eventCollege;
    private LocalDateTime eventDateTime;
    private Long eventId;
    private Integer quantity;
    private BigDecimal totalAmount;
    private String paymentRef;
    private String status;
    private LocalDateTime bookedAt;

    public static BookingResponse from(Booking booking) {
        BigDecimal total = booking.getEvent().getPrice()
                .multiply(BigDecimal.valueOf(booking.getQuantity()));

        return BookingResponse.builder()
                .bookingId(booking.getId())
                .eventTitle(booking.getEvent().getTitle())
                .eventCollege(booking.getEvent().getCollege())
                .eventDateTime(booking.getEvent().getDateTime())
                .eventId(booking.getEvent().getId())
                .quantity(booking.getQuantity())
                .totalAmount(total)
                .paymentRef(booking.getPaymentRef())
                .status(booking.getStatus().name())
                .bookedAt(booking.getBookedAt())
                .build();
    }
}
