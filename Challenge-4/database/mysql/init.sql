-- MySQL initialization script for Docker
-- This SQL script will run automatically when the MySQL container starts

-- Database creation is handled by Docker environment variables
-- The MYSQL_DATABASE environment variable creates the database automatically

-- Grant privileges to the laravel user (created by Docker environment variables)
GRANT ALL PRIVILEGES ON laravel_challenge_4.* TO 'laravel'@'%';
FLUSH PRIVILEGES;