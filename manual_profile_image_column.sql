-- Manual Database Fix for Profile Image Column
-- Run this SQL if the Laravel migration doesn't work

-- Check if the column already exists
SELECT COLUMN_NAME 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'users' 
AND COLUMN_NAME = 'profile_image';

-- Add the profile_image column if it doesn't exist
-- Note: Adjust the position based on your table structure
ALTER TABLE users 
ADD COLUMN profile_image VARCHAR(255) NULL 
AFTER licence_professionnelle_url;

-- Verify the column was added
DESCRIBE users;

-- Show all columns to confirm structure
SHOW COLUMNS FROM users;
