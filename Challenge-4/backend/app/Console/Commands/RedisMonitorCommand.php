<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Redis;

class RedisMonitorCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'redis:monitor';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Monitor and test the Redis connection';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Testing Redis connection...');

        try {
            // Test the connection by setting a key
            $testKey = 'laravel_redis_test_' . time();
            Redis::set($testKey, 'Connection test successful');
            $value = Redis::get($testKey);
            
            if ($value === 'Connection test successful') {
                $this->info('✓ Successfully connected to Redis server');
                
                // Try a simple ping to verify connection is solid
                $ping = Redis::command('ping');
                if ($ping) {
                    $this->info('✓ Redis PING successful: ' . $ping);
                }
                
                // Try to safely get Redis information
                try {
                    // Get some basic Redis information (more resilient)
                    $this->info('Basic Redis commands test:');
                    
                    // Test DBSIZE command
                    $dbSize = Redis::dbsize();
                    $this->line('  - Current DB Size: ' . $dbSize);
                    
                    // Get Redis time
                    $time = Redis::time();
                    $this->line('  - Redis Server Time: ' . (is_array($time) ? implode(', ', $time) : $time));
                    
                    // Clean up test key
                    Redis::del($testKey);
                    
                    $this->info('✓ Redis connection is fully operational');
                } catch (\Exception $e) {
                    $this->warn('Redis info commands not fully supported, but basic connection works.');
                    $this->line('This is common when using certain Redis clients or versions.');
                }
                
                return Command::SUCCESS;
            } else {
                $this->error('✗ Redis connection test failed!');
                return Command::FAILURE;
            }
        } catch (\Exception $e) {
            $this->error('✗ Failed to connect to Redis!');
            $this->error('Error: ' . $e->getMessage());
            
            $this->info('');
            $this->info('Check your Redis configuration in .env file:');
            $this->line('  REDIS_HOST=' . env('REDIS_HOST', '127.0.0.1'));
            $this->line('  REDIS_PORT=' . env('REDIS_PORT', '6380'));
            $this->line('  REDIS_PASSWORD=' . env('REDIS_PASSWORD', 'null'));
            
            return Command::FAILURE;
        }
    }
}