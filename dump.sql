CREATE DATABASE IF NOT EXISTS taskdb DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE taskdb;

CREATE TABLE IF NOT EXISTS task (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50),
    created_at DATE
);

INSERT INTO task (title, description, status, created_at) VALUES
('Prepare presentation', 'Create slides', 'PENDING', '2025-06-23'),      
('Clean workspace', 'Organize desk', 'IN_PROGRESS', '2025-06-24'),       
('Review code', 'Check the new feature code', 'COMPLETED', '2025-06-20'),
('Plan sprint', 'Define tasks and goals', 'PENDING', '2025-06-27'),
('Play video game', 'Play new video game title', 'PENDING', '2025-06-01'),      
('Update documentation', 'Revise and update', 'IN_PROGRESS', '2025-06-22');

