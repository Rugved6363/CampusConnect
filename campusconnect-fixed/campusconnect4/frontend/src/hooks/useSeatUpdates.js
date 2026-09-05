import { useEffect, useState, useRef } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

export function useSeatUpdates(eventId, initialSeats) {
  const [availableSeats, setAvailableSeats] = useState(initialSeats)
  const [soldOut, setSoldOut]               = useState(initialSeats === 0)
  const [connected, setConnected]           = useState(false)
  const clientRef = useRef(null)

  // Sync initial seats when they change (e.g. after API load)
  useEffect(() => {
    setAvailableSeats(initialSeats)
    setSoldOut(initialSeats === 0)
  }, [initialSeats])

  useEffect(() => {
    if (!eventId) return

    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true)
        client.subscribe(`/topic/events/${eventId}/seats`, (message) => {
          try {
            const data = JSON.parse(message.body)
            setAvailableSeats(data.availableSeats)
            setSoldOut(data.soldOut)
          } catch (e) {
            console.error('WS parse error:', e)
          }
        })
      },
      onDisconnect: () => setConnected(false),
      onStompError: (frame) => {
        console.warn('STOMP error:', frame.headers['message'])
      },
    })

    client.activate()
    clientRef.current = client

    return () => {
      client.deactivate()
    }
  }, [eventId])

  return { availableSeats, soldOut, connected }
}
