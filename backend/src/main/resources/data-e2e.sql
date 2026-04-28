MERGE INTO users (username, email, password_hash, role, enabled, created_at)
KEY(username)
VALUES ('admin', 'admin@rmt.local', '$2a$10$7EqJtq98hPqEX7fNZaFWoO5Gk5hgbf28pQ5e0MyoVo9zc3rroWAtG', 'ADMIN', TRUE, CURRENT_TIMESTAMP);
