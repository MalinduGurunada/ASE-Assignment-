INSERT INTO users (username, email, password_hash, role, enabled)
SELECT 'admin',
       'admin@rmt.local',
       '$2a$10$7EqJtq98hPqEX7fNZaFWoO5Gk5hgbf28pQ5e0MyoVo9zc3rroWAtG',
       'ADMIN',
       TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE username = 'admin'
);

UPDATE users
SET password_hash = '$2a$10$7EqJtq98hPqEX7fNZaFWoO5Gk5hgbf28pQ5e0MyoVo9zc3rroWAtG',
    role = 'ADMIN',
    enabled = TRUE
WHERE username = 'admin';

UPDATE releases
SET status = 'TESTING'
WHERE status = 'IN_PROGRESS';

UPDATE releases
SET status = 'DRAFT'
WHERE status = 'PLANNED';

UPDATE deployments
SET status = 'DEPLOYED'
WHERE status = 'SUCCESS';
