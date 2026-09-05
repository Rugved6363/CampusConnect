# 🎓 CampusConnect

> Real-Time College Event Discovery & Booking Platform

A full-stack web application built with **Spring Boot 3** + **React 18 (Vite)**.  
Students can discover campus events, view live seat availability (WebSocket), and book tickets.

---

## 🗂️ Project Structure

```
campusconnect/
├── backend/          # Spring Boot 3, Java 17
└── frontend/         # React 18, Vite
```

---

## ⚙️ Tech Stack

| Layer       | Technology                              |
|-------------|----------------------------------------|
| Backend     | Java 17, Spring Boot 3.2               |
| Auth        | Spring Security + JWT (jjwt 0.11.5)    |
| ORM         | Spring Data JPA + Hibernate            |
| Database    | MySQL 8.x                              |
| Real-Time   | Spring WebSocket + STOMP + SockJS      |
| Frontend    | React 18, Vite 5                       |
| HTTP Client | Axios                                  |
| Routing     | React Router v6                        |
| WS Client   | @stomp/stompjs + sockjs-client         |

---

## 🛢️ MySQL Setup

### 1. Start MySQL (ensure version 8.x)

```bash
mysql -u root -p
```

### 2. Create the database

```sql
CREATE DATABASE campusconnect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

That's it — the tables are created automatically by JPA (`ddl-auto=update`).  
Seed data is loaded from `data.sql` on first run.

### 3. Update credentials (if needed)

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

---

## 🚀 Running the Backend

### Prerequisites
- Java 17+
- Maven 3.8+
- MySQL 8 running on port 3306

```bash
cd campusconnect/backend
mvn clean install -DskipTests
mvn spring-boot:run
```

Backend starts at → **http://localhost:8080**

### Verify it's working
```
GET http://localhost:8080/api/events
```
Should return a JSON list of seeded events.

---

## 🖥️ Running the Frontend

### Prerequisites
- Node.js 18+
- npm 9+

```bash
cd campusconnect/frontend
npm install
npm run dev
```

Frontend starts at → **http://localhost:5173**

---

## 🔌 Ports Used

| Service   | Port |
|-----------|------|
| Backend   | 8080 |
| Frontend  | 5173 |
| MySQL     | 3306 |
| WebSocket | 8080 (via /ws endpoint) |

---

## 🔐 API Reference

### Auth

| Method | Endpoint           | Auth | Description     |
|--------|--------------------|------|-----------------|
| POST   | /api/auth/signup   | No   | Register user   |
| POST   | /api/auth/login    | No   | Login, get JWT  |

### Events

| Method | Endpoint                    | Auth | Description               |
|--------|-----------------------------|------|---------------------------|
| GET    | /api/events                 | No   | List all events (filtered)|
| GET    | /api/events/{id}            | No   | Event detail              |
| GET    | /api/events/trending        | No   | Top 5 trending events     |
| GET    | /api/events/colleges        | No   | Distinct college list     |

**Query params for GET /api/events:**
- `college` — filter by college name
- `category` — CULTURAL / TECHNICAL / SPORTS / WORKSHOP
- `page` — page number (default: 0)
- `size` — page size (default: 12)
- `sort` — e.g. `dateTime,asc`

### Bookings (JWT required)

| Method | Endpoint                    | Description              |
|--------|-----------------------------|--------------------------|
| POST   | /api/bookings               | Book tickets             |
| GET    | /api/users/{id}/bookings    | User's booking history   |
| DELETE | /api/bookings/{id}          | Cancel a booking         |

### WebSocket

```
ws://localhost:8080/ws  (SockJS endpoint)

Subscribe: /topic/events/{eventId}/seats

Server pushes on every booking:
{
  "eventId": 1,
  "availableSeats": 45,
  "soldOut": false
}
```

---

## 👤 Demo Accounts (Seeded)

| Email                   | Password    | Role    |
|-------------------------|-------------|---------|
| arjun@vjti.ac.in        | password123 | STUDENT |
| priya@iitb.ac.in        | password123 | STUDENT |
| admin@campusconnect.in  | password123 | ADMIN   |

---

## 🧪 Testing the Real-Time Feature

1. Open **two browser tabs** on the same event detail page
2. Book tickets in **one tab**
3. Watch the seat counter update **live in the other tab** — no refresh needed

---

## 🗃️ Database Schema (Auto-created by JPA)

```sql
users       -- id, name, email, password, role, created_at
events      -- id, title, description, college, category, total_seats,
            --   available_seats, price, date_time, venue, poster_url, version, created_at
bookings    -- id, user_id, event_id, quantity, status, payment_ref, booked_at
```

---

## ⚡ Concurrency Safety

Booking is protected against race conditions via:
1. **Pessimistic locking** — `SELECT FOR UPDATE` on the event row during booking
2. **`@Version`** — optimistic lock on the Event entity as a fallback
3. **`@Transactional`** — entire seat decrement + booking insert in one atomic transaction

---

## 📁 Full Folder Structure

```
backend/src/main/java/com/campusconnect/
├── CampusConnectApplication.java
├── config/
│   ├── CorsConfig.java
│   ├── SecurityConfig.java
│   └── WebSocketConfig.java
├── controller/
│   ├── AuthController.java
│   ├── BookingController.java
│   └── EventController.java
├── dto/
│   ├── request/  (SignupRequest, LoginRequest, BookingRequest)
│   └── response/ (AuthResponse, EventResponse, BookingResponse, SeatUpdatePayload)
├── entity/
│   ├── Booking.java
│   ├── Event.java
│   └── User.java
├── exception/
│   ├── GlobalExceptionHandler.java
│   ├── InsufficientSeatsException.java
│   └── ResourceNotFoundException.java
├── repository/
│   ├── BookingRepository.java
│   ├── EventRepository.java
│   └── UserRepository.java
├── security/
│   ├── JwtFilter.java
│   ├── JwtUtil.java
│   └── UserDetailsServiceImpl.java
└── service/
    ├── AuthService.java
    ├── BookingService.java
    ├── EventService.java
    └── NotificationService.java

frontend/src/
├── api/          (axiosInstance, authApi, eventsApi, bookingsApi)
├── components/   (Navbar, EventCard, FilterBar, LiveSeatCounter, PaymentSimulator)
├── context/      (AuthContext)
├── hooks/        (useSeatUpdates)
├── pages/        (Home, EventDetail, Booking, Profile, Login, Signup)
└── utils/        (formatters)
```

---

## 🐳 Docker (Optional)

```yaml
# docker-compose.yml (create in root)
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: campusconnect
    ports:
      - "3306:3306"

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    depends_on:
      - mysql
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/campusconnect?...
      SPRING_DATASOURCE_PASSWORD: root
```

---

*CampusConnect — Built for students, by builders who think in systems.*
