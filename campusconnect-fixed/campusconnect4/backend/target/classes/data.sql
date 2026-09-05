-- CampusConnect Seed Data
-- This runs after JPA creates tables via ddl-auto=update

INSERT IGNORE INTO users (name, email, password, role, college_name, approved, created_at) VALUES
('Admin User',  'admin@campusconnect.in', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8RdhpNQnYN5DTyrbC2', 'ADMIN',   NULL,        true, NOW()),
('Arjun Sharma','arjun@vjti.ac.in',       '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8RdhpNQnYN5DTyrbC2', 'STUDENT', NULL,        true, NOW()),
('Priya Nair',  'priya@iitb.ac.in',       '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8RdhpNQnYN5DTyrbC2', 'STUDENT', NULL,        true, NOW());
-- Password for all seed users: password123
-- Admin login: admin@campusconnect.in / password123

INSERT IGNORE INTO events (title, description, college, category, total_seats, available_seats, price, date_time, venue, poster_url, version, created_at) VALUES
('CodeFest 2025', 'A 24-hour hackathon for college developers. Build, innovate, and compete for prizes worth ₹1,00,000. Open to all engineering students. Form teams of 2-4 and solve real-world problems.', 'VJTI Mumbai', 'TECHNICAL', 100, 100, 200.00, DATE_ADD(NOW(), INTERVAL 7 DAY), 'IT Department Auditorium, VJTI', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800', 0, NOW()),

('Mood Indigo 2025', 'Asia''s largest college cultural festival hosted by IIT Bombay. Three days of music, dance, drama, and art. Featuring national-level performances and celebrity appearances.', 'IIT Bombay', 'CULTURAL', 500, 500, 350.00, DATE_ADD(NOW(), INTERVAL 14 DAY), 'Convocation Hall, IIT Bombay', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', 0, NOW()),

('Technovanza 2025', 'VJTI''s annual technical festival with competitions in robotics, coding, and electronics. Paper presentations, project exhibitions, and industry talks from leading engineers.', 'VJTI Mumbai', 'TECHNICAL', 200, 200, 150.00, DATE_ADD(NOW(), INTERVAL 10 DAY), 'Main Auditorium, VJTI', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800', 0, NOW()),

('Inter-College Football Cup', 'Annual inter-college football championship. 16 teams, knockout format. Cheer for your college and witness electrifying matches. Free entry for spectators.', 'NMIMS Mumbai', 'SPORTS', 300, 300, 0.00, DATE_ADD(NOW(), INTERVAL 5 DAY), 'NMIMS Sports Ground', 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800', 0, NOW()),

('AI/ML Workshop', 'Hands-on workshop on Machine Learning fundamentals and deep learning with PyTorch. Bring your laptop. All skill levels welcome. Certificate provided on completion.', 'SPIT Mumbai', 'WORKSHOP', 60, 60, 500.00, DATE_ADD(NOW(), INTERVAL 3 DAY), 'Computer Lab 3, SPIT', 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800', 0, NOW()),

('Nukkad Natak Festival', 'Street play competition celebrating social issues through performance art. Teams from 20+ colleges. Open mic sessions and improv rounds. Free entry.', 'Jai Hind College', 'CULTURAL', 250, 250, 0.00, DATE_ADD(NOW(), INTERVAL 8 DAY), 'College Amphitheatre, Jai Hind', 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800', 0, NOW()),

('Cybersecurity Bootcamp', 'Two-day intensive bootcamp on ethical hacking, penetration testing, and network security. CTF challenge on Day 2 with cash prizes. Pre-registration required.', 'DJ Sanghvi', 'WORKSHOP', 80, 80, 750.00, DATE_ADD(NOW(), INTERVAL 12 DAY), 'Seminar Hall, DJ Sanghvi', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800', 0, NOW()),

('Entrepreneurship Summit', 'Annual e-summit with startup pitches, investor panels, and keynotes from unicorn founders. Networking sessions and live pitch competition with ₹5L funding up for grabs.', 'NMIMS Mumbai', 'TECHNICAL', 400, 400, 299.00, DATE_ADD(NOW(), INTERVAL 20 DAY), 'NMIMS Auditorium', 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800', 0, NOW()),

('Classical Dance Competition', 'Inter-college classical dance competition featuring Bharatanatyam, Kathak, Odissi, and Kuchipudi. Professional jury. Cash prizes and trophies for top performers.', 'Sophia College', 'CULTURAL', 150, 150, 100.00, DATE_ADD(NOW(), INTERVAL 9 DAY), 'Sophia Auditorium', 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800', 0, NOW()),

('React.js Deep Dive', 'One-day advanced React workshop covering hooks, context, performance optimization, and modern patterns. Build a full app from scratch. Limited seats.', 'SPIT Mumbai', 'WORKSHOP', 40, 40, 600.00, DATE_ADD(NOW(), INTERVAL 6 DAY), 'Computer Lab 1, SPIT', 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800', 0, NOW()),

('Cricket T20 Tournament', 'Inter-college T20 cricket tournament. 12 teams, 3 venues, 2 days of non-stop cricket. Finals on Day 2 at the main stadium. Free entry for all spectators.', 'IIT Bombay', 'SPORTS', 500, 500, 0.00, DATE_ADD(NOW(), INTERVAL 15 DAY), 'IIT Bombay Cricket Ground', 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800', 0, NOW()),

('Startup Weekend', '54-hour startup challenge. Ideate, build, and launch a product in a weekend. Mentorship from industry experts. Teams of 3-5. Winner gets incubation support.', 'DJ Sanghvi', 'WORKSHOP', 120, 120, 400.00, DATE_ADD(NOW(), INTERVAL 18 DAY), 'Innovation Hub, DJ Sanghvi', 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800', 0, NOW());

-- ═══════════════════════════════════════════════════════════════════
-- MOOD INDIGO FESTIVAL HIERARCHY
-- The main "Mood Indigo 2025" event row (id=2) is already inserted above.
-- Step 1: Create the Festival record pointing at that event.
-- Step 2: Create 10 FestivalCategories under it.
-- Step 3: Insert sub-event Event rows with festival_category_id set.
-- ═══════════════════════════════════════════════════════════════════

-- 1. Festival record (links to main Mood Indigo event)
INSERT IGNORE INTO festivals (id, main_event_id, name, description, college, edition,
    start_date, end_date, venue, poster_url, website_url, created_at)
SELECT 1,
    e.id,
    'Mood Indigo 2025',
    'Asia''s largest college cultural festival hosted by IIT Bombay. Spanning 4 days, Mood Indigo brings together 100,000+ students from across India for music, dance, comedy, art, fashion, sports, and more. A Main Pass is required for campus entry; individual sub-events can be booked separately.',
    'IIT Bombay',
    '52nd Edition',
    DATE_ADD(NOW(), INTERVAL 14 DAY),
    DATE_ADD(NOW(), INTERVAL 17 DAY),
    'IIT Bombay Campus, Powai, Mumbai',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    'https://moodi.org',
    NOW()
FROM events e
WHERE e.title = 'Mood Indigo 2025'
  AND NOT EXISTS (SELECT 1 FROM festivals WHERE id = 1);

-- 2. Festival Categories (10 tracks)
INSERT IGNORE INTO festival_categories (id, festival_id, name, description, icon, display_order) VALUES
(1,  1, 'Pro Shows',                   'Bollywood nights, EDM, Indie/Fusion — headline concerts by top artists.',                              '🎤', 1),
(2,  1, 'Comedy & Celebrity',          'Stand-up comedy shows and live celebrity interactions & film promotions.',                              '😂', 2),
(3,  1, 'Performing Arts',             'Dance battles, theatre, street plays, band wars, and singing competitions.',                           '💃', 3),
(4,  1, 'Fashion & Lifestyle',         'Runway fashion shows, cosplay, themed fashion events, and lifestyle exhibitions.',                     '👗', 4),
(5,  1, 'Fine Arts',                   'Drawing, canvas painting, street art graffiti, art installations, and design competitions.',           '🎨', 5),
(6,  1, 'Informals & Fun Events',      'Treasure hunts, e-sports, LAN gaming, mini-games, carnival booths, and group adventures.',             '🎮', 6),
(7,  1, 'Talent & Open Stage',         'Open mic, poetry slams, rap battles, music battles, and Mood Indigo''s Got Talent showcase.',          '🎤', 7),
(8,  1, 'Film & Media',                'Short film competitions, film screenings, photo contests, and filmmaking challenges.',                  '🎬', 8),
(9,  1, 'Exhibitions & Flea Market',   'Food zone, shopping flea market, merchandise stalls, brand booths, and art displays.',                 '🛍️', 9),
(10, 1, 'Workshops & Talks',           'Dance, music, and skill workshops plus interactive guest talks and cultural sessions.',                 '🧠', 10);

-- ─────────────────────────────────────────────────────────────────
-- 3. Sub-events — inserted as Event rows with festival_category_id
--    Each sub-event is bookable independently via /book/:id
--    All are at IIT Bombay. Date offsets spread across 4 festival days.
-- ─────────────────────────────────────────────────────────────────

-- ── CAT 1: Pro Shows (7 events) ──
INSERT IGNORE INTO events
    (title, description, college, category, total_seats, available_seats, price, date_time, venue, poster_url, version, created_at, festival_category_id)
VALUES
('Bollywood Night – Sonu Nigam',
 'An unforgettable evening with the legendary Sonu Nigam performing his greatest Bollywood hits live on the main stage. Expect classics spanning three decades of Hindi cinema.',
 'IIT Bombay', 'CULTURAL', 3000, 3000, 299.00,
 DATE_ADD(NOW(), INTERVAL 14 DAY), 'Main Stage, IIT Bombay',
 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800', 0, NOW(), 1),

('Hip-Hop Night – Seedhe Maut',
 'Delhi''s hottest hip-hop duo Seedhe Maut bring raw energy and powerful verses to Mood Indigo. Experience live desi hip-hop like never before.',
 'IIT Bombay', 'CULTURAL', 2500, 2500, 249.00,
 DATE_ADD(NOW(), INTERVAL 14 DAY), 'Main Stage, IIT Bombay',
 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800', 0, NOW(), 1),

('Karma Chaar Diwaari – Indie Night',
 'An intimate indie music night featuring Karma and Chaar Diwaari blending folk, indie, and alternative sounds in a mesmerising open-air concert.',
 'IIT Bombay', 'CULTURAL', 1500, 1500, 199.00,
 DATE_ADD(NOW(), INTERVAL 15 DAY), 'Open Air Theatre, IIT Bombay',
 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800', 0, NOW(), 1),

('Indie & Fusion Night – Dhruv & Bhaskar Collective',
 'Dhruv and Bhaskar Collective present a genre-blending fusion evening combining western indie with Indian classical influences for a truly unique live experience.',
 'IIT Bombay', 'CULTURAL', 1800, 1800, 199.00,
 DATE_ADD(NOW(), INTERVAL 15 DAY), 'Open Air Theatre, IIT Bombay',
 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800', 0, NOW(), 1),

('Sufi Night – Bismil',
 'Bismil takes you on a soulful Sufi journey with qawwali, ghazal, and folk melodies under the open sky. A deeply spiritual and moving musical experience.',
 'IIT Bombay', 'CULTURAL', 2000, 2000, 179.00,
 DATE_ADD(NOW(), INTERVAL 16 DAY), 'Main Stage, IIT Bombay',
 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800', 0, NOW(), 1),

('EDM Night – Romeo Blanco',
 'International DJ Romeo Blanco drops beats across multiple genres — progressive house, trance, and future bass — in an electrifying all-night EDM rave.',
 'IIT Bombay', 'CULTURAL', 4000, 4000, 349.00,
 DATE_ADD(NOW(), INTERVAL 17 DAY), 'Main Stage, IIT Bombay',
 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800', 0, NOW(), 1),

('Closing Ceremony Pro Show',
 'Grand closing ceremony featuring a surprise headliner performance, fireworks display, and a spectacular send-off for Mood Indigo 2025.',
 'IIT Bombay', 'CULTURAL', 5000, 5000, 399.00,
 DATE_ADD(NOW(), INTERVAL 17 DAY), 'Main Stage, IIT Bombay',
 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800', 0, NOW(), 1),

-- ── CAT 2: Comedy & Celebrity (5 events) ──
('Stand-Up Comedy – Rahul Subramanian',
 'Chart-topping comedian Rahul Subramanian brings his signature observational humour, witty storytelling, and relatable everyday anecdotes to Mood Indigo 2025. An evening of non-stop laughter.',
 'IIT Bombay', 'CULTURAL', 1200, 1200, 299.00,
 DATE_ADD(NOW(), INTERVAL 14 DAY), 'SAC Auditorium, IIT Bombay',
 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800', 0, NOW(), 2),

('Celebrity Interaction – Vicky Kaushal',
 'An exclusive fan interaction and Q&A session with Bollywood superstar Vicky Kaushal. Discuss his journey, films, and life beyond the silver screen.',
 'IIT Bombay', 'CULTURAL', 800, 800, 349.00,
 DATE_ADD(NOW(), INTERVAL 15 DAY), 'Convocation Hall, IIT Bombay',
 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800', 0, NOW(), 2),

('Celebrity Interaction – Rakul Preet Singh & Pulkit Samrat',
 'Join Rakul Preet Singh and Pulkit Samrat for a candid conversation about their careers, relationships, and upcoming projects.',
 'IIT Bombay', 'CULTURAL', 600, 600, 249.00,
 DATE_ADD(NOW(), INTERVAL 15 DAY), 'SAC Auditorium, IIT Bombay',
 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', 0, NOW(), 2),

('Celebrity Interaction – Jaideep Ahlawat',
 'An intimate session with critically acclaimed actor Jaideep Ahlawat — the man behind Hathiram Chaudhary. Discuss craft, process, and his remarkable rise in Bollywood.',
 'IIT Bombay', 'CULTURAL', 700, 700, 299.00,
 DATE_ADD(NOW(), INTERVAL 16 DAY), 'Convocation Hall, IIT Bombay',
 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800', 0, NOW(), 2),

('Celebrity Interaction – Archana Puran Singh',
 'The iconic Archana Puran Singh talks about her decades-long journey in Bollywood and television, her most memorable roles, and life behind the camera.',
 'IIT Bombay', 'CULTURAL', 600, 600, 199.00,
 DATE_ADD(NOW(), INTERVAL 16 DAY), 'SAC Auditorium, IIT Bombay',
 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800', 0, NOW(), 2),

-- ── CAT 3: Performing Arts (6 events) ──
('Solo Dance Competition',
 'Showcase your individual dance prowess in any style — classical, contemporary, hip-hop, or freestyle. Professional jury panel with cash prizes for top 3 performers.',
 'IIT Bombay', 'CULTURAL', 200, 200, 100.00,
 DATE_ADD(NOW(), INTERVAL 14 DAY), 'Gymkhana Lawns, IIT Bombay',
 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800', 0, NOW(), 3),

('Group Dance Battle',
 'Teams of 5–10 compete in a thrilling group dance battle. Any genre welcome. Judged on choreography, synchronisation, creativity, and stage presence.',
 'IIT Bombay', 'CULTURAL', 300, 300, 80.00,
 DATE_ADD(NOW(), INTERVAL 14 DAY), 'Gymkhana Lawns, IIT Bombay',
 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800', 0, NOW(), 3),

('Street Dance Battles',
 'Cypher-style street dance battles open to all — breaking, popping, locking, waacking. Bring your crew or battle solo. Free-form judging by India''s top b-boys.',
 'IIT Bombay', 'CULTURAL', 400, 400, 50.00,
 DATE_ADD(NOW(), INTERVAL 15 DAY), 'Main Quad, IIT Bombay',
 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=800', 0, NOW(), 3),

('Theatre – Stage Plays Competition',
 'Inter-college theatre competition. Full-length stage plays (20–40 min) judged on script, performance, direction, and stage design. Cash prizes for winning teams.',
 'IIT Bombay', 'CULTURAL', 250, 250, 70.00,
 DATE_ADD(NOW(), INTERVAL 15 DAY), 'SAC Auditorium, IIT Bombay',
 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800', 0, NOW(), 3),

('Nukkad Natak – Street Play Competition',
 'Hard-hitting street theatre with no stage, no props — just powerful performances addressing social issues. Teams of 8–15 members. A Mood Indigo tradition since the 1980s.',
 'IIT Bombay', 'CULTURAL', 500, 500, 0.00,
 DATE_ADD(NOW(), INTERVAL 16 DAY), 'Campus Streets, IIT Bombay',
 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800', 0, NOW(), 3),

('Band Wars – Music Competition',
 'Battle of the bands! College bands compete across rock, fusion, metal, and pop genres. Judged on musicianship, stage energy, and crowd response. Winner performs at the Pro Show.',
 'IIT Bombay', 'CULTURAL', 600, 600, 120.00,
 DATE_ADD(NOW(), INTERVAL 16 DAY), 'Open Air Theatre, IIT Bombay',
 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800', 0, NOW(), 3),

-- ── CAT 4: Fashion & Lifestyle (6 events) ──
('Fashion Show – She''s Got The Looks',
 'The premier women''s fashion showcase of Mood Indigo. Participants model original ensembles judged on style, confidence, and creativity by an industry expert panel.',
 'IIT Bombay', 'CULTURAL', 300, 300, 150.00,
 DATE_ADD(NOW(), INTERVAL 14 DAY), 'Main Stage, IIT Bombay',
 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800', 0, NOW(), 4),

('Mr & Mrs Mood Indigo',
 'The flagship couple fashion event. Pairs compete in themed rounds — traditional, western, and fusion — showcasing chemistry, styling, and on-stage charisma.',
 'IIT Bombay', 'CULTURAL', 400, 400, 100.00,
 DATE_ADD(NOW(), INTERVAL 15 DAY), 'Gymkhana Lawns, IIT Bombay',
 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800', 0, NOW(), 4),

('Trashion – Recycled Fashion Show',
 'Fashion made entirely from recycled and upcycled materials. Participants create wearable art from waste — judged on creativity, sustainability message, and overall presentation.',
 'IIT Bombay', 'CULTURAL', 250, 250, 80.00,
 DATE_ADD(NOW(), INTERVAL 15 DAY), 'Main Quad, IIT Bombay',
 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800', 0, NOW(), 4),

('Cosplay – Character Showcase',
 'Dress as your favourite character from anime, games, films, or comics and walk the Mood Indigo ramp. Judged on accuracy, craftsmanship, and character portrayal.',
 'IIT Bombay', 'CULTURAL', 350, 350, 60.00,
 DATE_ADD(NOW(), INTERVAL 16 DAY), 'Gymkhana Lawns, IIT Bombay',
 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800', 0, NOW(), 4),

('Lifestyle & Wellness Expo',
 'A curated exhibition of brands, designers, and wellness practitioners. Browse handcrafted fashion, sustainable lifestyle products, and participate in mini wellness sessions.',
 'IIT Bombay', 'CULTURAL', 1000, 1000, 0.00,
 DATE_ADD(NOW(), INTERVAL 16 DAY), 'Exhibition Area, IIT Bombay',
 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800', 0, NOW(), 4),

('Themed Costume Contest',
 'This year''s theme: Mythology Meets Future. Students come dressed as mythological characters reimagined in a futuristic world. Best costume wins exciting prizes.',
 'IIT Bombay', 'CULTURAL', 500, 500, 0.00,
 DATE_ADD(NOW(), INTERVAL 17 DAY), 'Main Quad, IIT Bombay',
 'https://images.unsplash.com/photo-1561479900-788f674beacb?w=800', 0, NOW(), 4),

-- ── CAT 5: Fine Arts (6 events) ──
('Sketching Competition',
 'On-the-spot sketching challenge. Theme revealed at the start. Participants have 90 minutes to create a pencil sketch or charcoal drawing. Open to all skill levels.',
 'IIT Bombay', 'CULTURAL', 200, 200, 50.00,
 DATE_ADD(NOW(), INTERVAL 14 DAY), 'Fine Arts Studio, IIT Bombay',
 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800', 0, NOW(), 5),

('Canvas Painting Competition',
 'Acrylic or watercolour on provided canvas. Theme: "The City That Never Sleeps". Judged on technique, interpretation, and originality. All paints and brushes provided.',
 'IIT Bombay', 'CULTURAL', 150, 150, 70.00,
 DATE_ADD(NOW(), INTERVAL 15 DAY), 'Fine Arts Studio, IIT Bombay',
 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800', 0, NOW(), 5),

('Street Art & Graffiti Wall',
 'A 60-foot wall is yours to paint. Teams of 2–4 take over sections of the campus boundary wall and create graffiti art. The best wall stays up for the entire festival.',
 'IIT Bombay', 'CULTURAL', 100, 100, 100.00,
 DATE_ADD(NOW(), INTERVAL 14 DAY), 'Campus Boundary Wall, IIT Bombay',
 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=800', 0, NOW(), 5),

('Art Installation Exhibition',
 'An open exhibition of student-made art installations across the campus. Vote for your favourite. Grand Installation Prize awarded on the final day of the festival.',
 'IIT Bombay', 'CULTURAL', 2000, 2000, 0.00,
 DATE_ADD(NOW(), INTERVAL 14 DAY), 'Campus Wide, IIT Bombay',
 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=800', 0, NOW(), 5),

('Digital Design Competition',
 'Design a poster, logo, or UI concept for a fictional brand — brief revealed on the day. Participants use their own laptops. Judged on visual impact and concept.',
 'IIT Bombay', 'TECHNICAL', 120, 120, 80.00,
 DATE_ADD(NOW(), INTERVAL 16 DAY), 'Computer Centre, IIT Bombay',
 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800', 0, NOW(), 5),

('Photography Contest – Shoot the Fest',
 'Capture the magic of Mood Indigo. Submit your best festival photograph taken during the event. Categories: Portrait, Action, Architecture, and Abstract.',
 'IIT Bombay', 'CULTURAL', 500, 500, 0.00,
 DATE_ADD(NOW(), INTERVAL 14 DAY), 'Campus Wide, IIT Bombay',
 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800', 0, NOW(), 5),

-- ── CAT 6: Informals & Fun Events (6 events) ──
('Treasure Hunt',
 'A campus-wide treasure hunt with cryptic clues, puzzles, and physical challenges. Teams of 4–6. Navigate the IIT Bombay campus to find the hidden treasure before rival teams.',
 'IIT Bombay', 'CULTURAL', 400, 400, 60.00,
 DATE_ADD(NOW(), INTERVAL 14 DAY), 'Campus Wide, IIT Bombay',
 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800', 0, NOW(), 6),

('E-Sports – BGMI Tournament',
 'Battlegrounds Mobile India squad tournament. 4-member teams. Double elimination bracket. Prizes for top 3 squads. Bring your own device. Register as a squad.',
 'IIT Bombay', 'TECHNICAL', 200, 200, 150.00,
 DATE_ADD(NOW(), INTERVAL 14 DAY), 'Student Activity Centre, IIT Bombay',
 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800', 0, NOW(), 6),

('LAN Gaming – Valorant Championship',
 'Competitive LAN tournament for Valorant. 5v5 teams on provided rigs. Swiss-format group stage followed by single-elimination playoffs. Prizes for the champion team.',
 'IIT Bombay', 'TECHNICAL', 100, 100, 200.00,
 DATE_ADD(NOW(), INTERVAL 15 DAY), 'Computer Centre, IIT Bombay',
 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800', 0, NOW(), 6),

('Mini-Games Carnival',
 'A collection of fun party games — dumb charades, human foosball, tug-of-war, sack race, and more. Open to everyone. Spot prizes throughout the day. Free entry!',
 'IIT Bombay', 'SPORTS', 1000, 1000, 0.00,
 DATE_ADD(NOW(), INTERVAL 15 DAY), 'Gymkhana Grounds, IIT Bombay',
 'https://images.unsplash.com/photo-1526779259212-939e64788e3c?w=800', 0, NOW(), 6),

('Carnival Booths & Games Zone',
 'Classic carnival stall games — ring toss, balloon darts, hook-a-duck, and more. Win prizes. Perfect for a casual break between events. Open all four days.',
 'IIT Bombay', 'CULTURAL', 2000, 2000, 0.00,
 DATE_ADD(NOW(), INTERVAL 14 DAY), 'Hostel Area, IIT Bombay',
 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800', 0, NOW(), 6),

('Group Adventure Challenge',
 'An outdoor team challenge combining physical and mental tasks — trust falls, obstacle courses, problem-solving puzzles. Designed for teams of 8–12. Great for college groups.',
 'IIT Bombay', 'SPORTS', 300, 300, 100.00,
 DATE_ADD(NOW(), INTERVAL 16 DAY), 'Sports Complex, IIT Bombay',
 'https://images.unsplash.com/photo-1501139083538-0139583c060f?w=800', 0, NOW(), 6),

-- ── CAT 7: Talent & Open Stage (7 events) ──
('Mood Indigo Got Talent',
 'The ultimate talent showcase — any act, any skill, any art form. Sing, dance, juggle, beatbox, or surprise us. Audience voting + jury scores determine the winner.',
 'IIT Bombay', 'CULTURAL', 800, 800, 50.00,
 DATE_ADD(NOW(), INTERVAL 14 DAY), 'Open Air Theatre, IIT Bombay',
 'https://images.unsplash.com/photo-1516307365426-bea591f05011?w=800', 0, NOW(), 7),

('Open Mic Night',
 'Three minutes, the stage, and your voice. Original comedy, spoken word, impressions, original songs — all welcome. Sign up at the venue on the day.',
 'IIT Bombay', 'CULTURAL', 300, 300, 0.00,
 DATE_ADD(NOW(), INTERVAL 14 DAY), 'SAC Foyer, IIT Bombay',
 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800', 0, NOW(), 7),

('Poetry Slam',
 'Spoken word poetry competition judged by audience response. Any language, any theme. Performers have 3 minutes to move, provoke, or inspire. Finals on Day 3.',
 'IIT Bombay', 'CULTURAL', 200, 200, 30.00,
 DATE_ADD(NOW(), INTERVAL 15 DAY), 'SAC Auditorium, IIT Bombay',
 'https://images.unsplash.com/photo-1455849318743-b2233052fcff?w=800', 0, NOW(), 7),

('Rap Battle',
 'Head-to-head rap battle tournament — Hindi, English, or mixed. Freestyle rounds followed by prepared rounds. Judged on flow, delivery, wordplay, and crowd reaction.',
 'IIT Bombay', 'CULTURAL', 400, 400, 80.00,
 DATE_ADD(NOW(), INTERVAL 15 DAY), 'Main Quad, IIT Bombay',
 'https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?w=800', 0, NOW(), 7),

('Singing Competition – Sargam',
 'Solo and duet singing competition spanning classical, semi-classical, Bollywood, and western genres. Professional sound system. Live accompaniment available on request.',
 'IIT Bombay', 'CULTURAL', 350, 350, 100.00,
 DATE_ADD(NOW(), INTERVAL 16 DAY), 'SAC Auditorium, IIT Bombay',
 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800', 0, NOW(), 7),

('Music Battle – Instrumental Showdown',
 'Solo instrumental battle — any instrument, any genre. Quarterfinals and semis during the day; live finals on the main stage in the evening. Prizes for top 3.',
 'IIT Bombay', 'CULTURAL', 200, 200, 80.00,
 DATE_ADD(NOW(), INTERVAL 16 DAY), 'Open Air Theatre, IIT Bombay',
 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800', 0, NOW(), 7),

('Campus Idol – Grand Talent Finale',
 'The grand finale talent competition. Finalists from all talent events compete for the Campus Idol title. Star-studded jury, live audience, and a cash prize of ₹50,000.',
 'IIT Bombay', 'CULTURAL', 1500, 1500, 150.00,
 DATE_ADD(NOW(), INTERVAL 17 DAY), 'Main Stage, IIT Bombay',
 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800', 0, NOW(), 7),

-- ── CAT 8: Film & Media (6 events) ──
('Short Film Competition',
 'Submit a short film (5–15 min) made within the last year. Genres: drama, comedy, documentary, or animation. Screening and jury deliberation over two days.',
 'IIT Bombay', 'CULTURAL', 300, 300, 120.00,
 DATE_ADD(NOW(), INTERVAL 14 DAY), 'SAC Auditorium, IIT Bombay',
 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800', 0, NOW(), 8),

('Film Screening – Independent Cinema Night',
 'A curated screening of award-winning independent Indian films followed by a director Q&A. Limited seating. A celebration of alternative cinema beyond mainstream Bollywood.',
 'IIT Bombay', 'CULTURAL', 250, 250, 80.00,
 DATE_ADD(NOW(), INTERVAL 15 DAY), 'LT 101 Auditorium, IIT Bombay',
 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800', 0, NOW(), 8),

('Photo Contest – Frames of India',
 'Theme: "Urban India at the Crossroads." Submit up to 5 photographs. Judged on composition, storytelling, technical quality, and relevance to the theme.',
 'IIT Bombay', 'CULTURAL', 500, 500, 0.00,
 DATE_ADD(NOW(), INTERVAL 14 DAY), 'Online Submission + Campus Display',
 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800', 0, NOW(), 8),

('Filmmaking Challenge – 24-Hour Shoot',
 'Make a short film in 24 hours. Theme revealed at the start. Teams of 3–5. Submit edited film by the deadline. Screened and judged on the final day. Cameras provided.',
 'IIT Bombay', 'CULTURAL', 100, 100, 200.00,
 DATE_ADD(NOW(), INTERVAL 15 DAY), 'Campus Wide, IIT Bombay',
 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800', 0, NOW(), 8),

('Media Quiz – Frames & Frequencies',
 'A quiz on Indian and world cinema, music, and media. Teams of 3. Multiple rounds including audio-visual clues, rapid fire, and a buzzer round. Prizes for top 3 teams.',
 'IIT Bombay', 'CULTURAL', 200, 200, 50.00,
 DATE_ADD(NOW(), INTERVAL 16 DAY), 'LT 101 Auditorium, IIT Bombay',
 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', 0, NOW(), 8),

('Podcast Recording Live',
 'Record a live podcast episode on stage — discuss culture, music, or college life. Audience participates. Episode released on Mood Indigo''s official podcast channel.',
 'IIT Bombay', 'CULTURAL', 150, 150, 0.00,
 DATE_ADD(NOW(), INTERVAL 17 DAY), 'SAC Foyer, IIT Bombay',
 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800', 0, NOW(), 8),

-- ── CAT 9: Exhibitions & Flea Market (6 events) ──
('Food Zone – Campus Food Carnival',
 'A massive food court with 50+ stalls serving cuisines from across India and the world. Street food, regional delicacies, desserts, beverages, and more. No ticket required.',
 'IIT Bombay', 'CULTURAL', 10000, 10000, 0.00,
 DATE_ADD(NOW(), INTERVAL 14 DAY), 'Hostel Area, IIT Bombay',
 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', 0, NOW(), 9),

('Flea Market – Shop & Discover',
 'A curated flea market with 80+ independent sellers showcasing handmade crafts, vintage clothing, books, jewellery, art prints, and indie lifestyle products.',
 'IIT Bombay', 'CULTURAL', 5000, 5000, 0.00,
 DATE_ADD(NOW(), INTERVAL 14 DAY), 'Exhibition Grounds, IIT Bombay',
 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800', 0, NOW(), 9),

('Official MI Merchandise Store',
 'Get your exclusive Mood Indigo 2025 merchandise — t-shirts, hoodies, tote bags, mugs, and collector edition posters. Limited stock. Early shoppers get first pick.',
 'IIT Bombay', 'CULTURAL', 2000, 2000, 0.00,
 DATE_ADD(NOW(), INTERVAL 14 DAY), 'Main Gate Area, IIT Bombay',
 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800', 0, NOW(), 9),

('Brand Experience Zone',
 'Top brands set up interactive booths — try products, win goodies, participate in brand challenges, and get exclusive deals. Sponsors include tech, FMCG, and lifestyle brands.',
 'IIT Bombay', 'CULTURAL', 3000, 3000, 0.00,
 DATE_ADD(NOW(), INTERVAL 14 DAY), 'Exhibition Area, IIT Bombay',
 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800', 0, NOW(), 9),

('Art & Craft Exhibition',
 'A gallery of student art — paintings, sculptures, installations, photography, and mixed media. Browse 200+ works from students across India. Artworks available for purchase.',
 'IIT Bombay', 'CULTURAL', 2000, 2000, 0.00,
 DATE_ADD(NOW(), INTERVAL 14 DAY), 'Gallery Space, IIT Bombay',
 'https://images.unsplash.com/photo-1536924430914-91f9e2041b83?w=800', 0, NOW(), 9),

('Innovation & Startup Expo',
 'Student startups and innovation projects showcase their work. Visitors can interact with founders, invest-in ideation sessions, and vote for their favourite product.',
 'IIT Bombay', 'TECHNICAL', 1500, 1500, 0.00,
 DATE_ADD(NOW(), INTERVAL 16 DAY), 'Innovation Hub, IIT Bombay',
 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800', 0, NOW(), 9),

-- ── CAT 10: Workshops & Talks (7 events) ──
('Dance Workshop – Bollywood Fusion',
 'A 2-hour Bollywood fusion dance workshop with a professional choreographer. Learn a full routine from scratch. Open to all levels — no prior experience needed.',
 'IIT Bombay', 'WORKSHOP', 100, 100, 150.00,
 DATE_ADD(NOW(), INTERVAL 14 DAY), 'Dance Studio, IIT Bombay',
 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800', 0, NOW(), 10),

('Dance Workshop – Contemporary & Modern',
 'Explore the fundamentals of contemporary dance with a trained dancer. Focus on body awareness, floor work, improvisation, and expression. Suitable for intermediate students.',
 'IIT Bombay', 'WORKSHOP', 60, 60, 180.00,
 DATE_ADD(NOW(), INTERVAL 15 DAY), 'Dance Studio, IIT Bombay',
 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800', 0, NOW(), 10),

('Music Production Workshop',
 'Hands-on DAW session — produce a full beat in 3 hours using Ableton Live. Topics: sampling, synthesis, mixing basics. Bring headphones. Laptops provided on request.',
 'IIT Bombay', 'WORKSHOP', 50, 50, 250.00,
 DATE_ADD(NOW(), INTERVAL 14 DAY), 'Music Lab, IIT Bombay',
 'https://images.unsplash.com/photo-1519683109079-d5f539e1542f?w=800', 0, NOW(), 10),

('Guitar Masterclass',
 'An advanced guitar masterclass covering fingerpicking, chord voicings, improvisation, and music theory. For intermediate to advanced players. Session by a touring musician.',
 'IIT Bombay', 'WORKSHOP', 40, 40, 200.00,
 DATE_ADD(NOW(), INTERVAL 15 DAY), 'Music Lab, IIT Bombay',
 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800', 0, NOW(), 10),

('Guest Talk – Art, Culture & Creativity',
 'An inspiring talk by a renowned artist, filmmaker, or cultural icon on their creative journey. Open panel Q&A follows the keynote. One of the most popular sessions at MI.',
 'IIT Bombay', 'CULTURAL', 600, 600, 0.00,
 DATE_ADD(NOW(), INTERVAL 15 DAY), 'Convocation Hall, IIT Bombay',
 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800', 0, NOW(), 10),

('Cultural Heritage Session',
 'An interactive session exploring India''s rich intangible cultural heritage — classical traditions, folk arts, and regional performing arts. Live demonstrations included.',
 'IIT Bombay', 'CULTURAL', 300, 300, 0.00,
 DATE_ADD(NOW(), INTERVAL 16 DAY), 'SAC Auditorium, IIT Bombay',
 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800', 0, NOW(), 10),

('Skill Workshop – Public Speaking & Debate',
 'A practical workshop on public speaking, body language, debate structure, and impromptu speaking. Includes mock debate rounds with peer feedback. Certificate on completion.',
 'IIT Bombay', 'WORKSHOP', 80, 80, 100.00,
 DATE_ADD(NOW(), INTERVAL 17 DAY), 'LT 201, IIT Bombay',
 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800', 0, NOW(), 10);

-- ═══════════════════════════════════════════════════════
-- MIGRATION: add start_time, end_time, parent_event_id
-- Safe to run multiple times due to IF NOT EXISTS workaround
-- ═══════════════════════════════════════════════════════
-- NOTE: Run these manually in MySQL Workbench if first startup:
-- ALTER TABLE events ADD COLUMN start_time DATETIME NULL;
-- ALTER TABLE events ADD COLUMN end_time   DATETIME NULL;
-- ALTER TABLE events ADD COLUMN parent_event_id BIGINT NULL;
-- ALTER TABLE events ADD CONSTRAINT fk_parent_event FOREIGN KEY (parent_event_id) REFERENCES events(id);
