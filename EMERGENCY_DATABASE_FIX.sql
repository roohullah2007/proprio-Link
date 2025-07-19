-- EMERGENCY DATABASE FIX FOR PROFILE IMAGES
-- Run this SQL script directly in your MySQL database if the migration fails

-- First, let's see what columns currently exist
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME = 'users'
ORDER BY ORDINAL_POSITION;

-- Add missing columns (will fail silently if they already exist)

-- Add UUID column
ALTER TABLE users ADD COLUMN uuid CHAR(36) NULL UNIQUE AFTER id;

-- Add French name fields
ALTER TABLE users ADD COLUMN prenom VARCHAR(255) NOT NULL AFTER uuid;
ALTER TABLE users ADD COLUMN nom VARCHAR(255) NOT NULL AFTER prenom;

-- Add telephone
ALTER TABLE users ADD COLUMN telephone VARCHAR(255) NULL AFTER email;

-- Add user type
ALTER TABLE users ADD COLUMN type_utilisateur ENUM('PROPRIETAIRE', 'AGENT', 'ADMIN') NOT NULL DEFAULT 'PROPRIETAIRE' AFTER telephone;

-- Add agent fields
ALTER TABLE users ADD COLUMN numero_siret VARCHAR(255) NULL AFTER type_utilisateur;
ALTER TABLE users ADD COLUMN licence_professionnelle_url VARCHAR(255) NULL AFTER numero_siret;

-- Add verification status
ALTER TABLE users ADD COLUMN est_verifie BOOLEAN NOT NULL DEFAULT 0 AFTER licence_professionnelle_url;

-- Add profile image column (THE MAIN FIX!)
ALTER TABLE users ADD COLUMN profile_image VARCHAR(255) NULL AFTER est_verifie;

-- Add other potentially missing columns
ALTER TABLE users ADD COLUMN is_suspended BOOLEAN NOT NULL DEFAULT 0 AFTER est_verifie;
ALTER TABLE users ADD COLUMN suspended_at TIMESTAMP NULL AFTER is_suspended;
ALTER TABLE users ADD COLUMN suspension_reason TEXT NULL AFTER suspended_at;
ALTER TABLE users ADD COLUMN language VARCHAR(10) NOT NULL DEFAULT 'fr' AFTER suspension_reason;

-- Verify the final structure
DESCRIBE users;

-- Mark the problematic migration as completed (optional)
-- You'll need to check your migrations table first:
-- SELECT * FROM migrations WHERE migration LIKE '%modify_users_table%';

-- If the migration exists and is causing issues, you might need to:
-- INSERT INTO migrations (migration, batch) VALUES ('2025_06_06_221615_modify_users_table_for_proprio_link', 1);

-- Final verification - show all user columns
SHOW COLUMNS FROM users;
