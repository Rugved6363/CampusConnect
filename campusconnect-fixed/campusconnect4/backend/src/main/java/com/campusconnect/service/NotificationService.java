package com.campusconnect.service;

import com.campusconnect.dto.response.SeatUpdatePayload;
import com.campusconnect.entity.Event;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public void broadcastSeatUpdate(Event event) {
        SeatUpdatePayload payload = new SeatUpdatePayload(
                event.getId(),
                event.getAvailableSeats(),
                event.getAvailableSeats() == 0
        );

        String destination = "/topic/events/" + event.getId() + "/seats";
        messagingTemplate.convertAndSend(destination, payload);
        log.debug("Seat update broadcast for event {}: {} seats remaining", event.getId(), event.getAvailableSeats());
    }
}
