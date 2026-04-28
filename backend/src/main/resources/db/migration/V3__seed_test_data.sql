-- Seed Products
INSERT INTO products (name, description) VALUES
('RMT Core', 'The core release management tool platform'),
('RMT Analytics plugin', 'Analytics extension for the RMT tool');

-- Seed Releases for 'RMT Core' (product_id = 1)
INSERT INTO releases (product_id, version, name, status, released_at) VALUES
(1, 'v1.0.0', 'Initial Release', 'RELEASED', CURRENT_TIMESTAMP),
(1, 'v1.1.0', 'Performance Update', 'TESTING', NULL);

-- Seed Releases for 'RMT Analytics plugin' (product_id = 2)
INSERT INTO releases (product_id, version, name, status, released_at) VALUES
(2, 'v0.9.0', 'Beta Release', 'DRAFT', NULL);

-- Seed Changelog Entries for 'Initial Release' (release_id = 1)
INSERT INTO changelog_entries (release_id, title, entry_type, description) VALUES
(1, 'Initial user module', 'FEATURE', 'Added authentication and user management'),
(1, 'Database setup', 'FEATURE', 'Configured Flyway and PostgreSQL schema'),
(1, 'Fix UI glitch', 'BUGFIX', 'Fixed alignment issues on the dashboard');

-- Seed Changelog Entries for 'Performance Update' (release_id = 2)
INSERT INTO changelog_entries (release_id, title, entry_type, description) VALUES
(2, 'Improve API response times', 'IMPROVEMENT', 'Added caching to the analytics endpoints');

-- Seed Deployments
INSERT INTO deployments (release_id, environment_name, status, rollback_available, deployed_at) VALUES
(1, 'Production', 'DEPLOYED', TRUE, CURRENT_TIMESTAMP),
(1, 'Staging', 'DEPLOYED', FALSE, CURRENT_TIMESTAMP),
(2, 'Staging', 'FAILED', TRUE, CURRENT_TIMESTAMP);

-- Seed a Viewer user (Password is 'password123')
INSERT INTO users (username, email, password_hash, role, enabled)
VALUES ('viewer_user', 'viewer@rmt.local', '$2a$10$x.U/eY89zYl8Qvj3DkXvVOTjX9.6jZ0/T6g8zE8lQ9Q4q2/7Z8Q7S', 'VIEWER', TRUE);
