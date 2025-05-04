@echo off
echo Setting up local database environment...

echo ===================================
echo Creating necessary directories
echo ===================================
if not exist "mysql\data" mkdir mysql\data
if not exist "redis\data" mkdir redis\data

echo ===================================
echo MySQL Setup Instructions
echo ===================================
echo 1. Make sure MySQL server is installed on your system
echo 2. Run the following command to initialize your database:
echo    mysql -u root -p < mysql\init.sql
echo 
echo If you need to change credentials, update your .env file in the backend directory

echo ===================================
echo Redis Setup Instructions
echo ===================================
echo 1. Make sure Redis server is installed on your system
echo 2. Start Redis using: redis-server redis.conf
echo
echo If you need to change Redis configuration, modify the redis.conf file

echo ===================================
echo Connection Test
echo ===================================
echo To test connections, run the following Laravel commands:
echo cd ..\backend
echo php artisan db:monitor
echo php artisan redis:monitor

echo ===================================
echo Setup complete!
echo ===================================