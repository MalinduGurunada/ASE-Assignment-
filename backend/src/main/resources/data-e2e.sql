MERGE INTO users (username, email, password_hash, role, enabled, created_at)
KEY(username)
VALUES ('admin', 'admin@rmt.local', '$2a$10$wrR6Cv3NHGGiROBQJRKWquc1dmFB0C5P4PFdiC79ncCMhPj8Dpl.q', 'ADMIN', TRUE, CURRENT_TIMESTAMP);
