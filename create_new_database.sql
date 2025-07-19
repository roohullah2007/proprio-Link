-- SQL commands to create new database and migrate data
-- Run these commands in your MySQL client or phpMyAdmin

-- 1. Create the new database
CREATE DATABASE IF NOT EXISTS proprio_link CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. If you want to copy data from the old database, uncomment the following:
-- This will copy all tables and data from 'propio' to 'proprio_link'

-- CREATE DATABASE proprio_link_backup;
-- mysqldump -u root -p propio | mysql -u root -p proprio_link;

-- 3. Grant permissions (adjust username as needed)
-- GRANT ALL PRIVILEGES ON proprio_link.* TO 'root'@'localhost';
-- FLUSH PRIVILEGES;

-- 4. Verify database creation
SHOW DATABASES LIKE 'proprio_link';
