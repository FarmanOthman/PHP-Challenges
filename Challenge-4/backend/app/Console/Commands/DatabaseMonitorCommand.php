<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class DatabaseMonitorCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:monitor';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Monitor and test the database connection';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Testing database connection...');

        try {
            $connection = DB::connection()->getPdo();
            $this->info('✓ Successfully connected to database: ' . DB::connection()->getDatabaseName());
            
            // Get some basic database information
            $tables = DB::select('SHOW TABLES');
            $this->info('✓ Database contains ' . count($tables) . ' tables');
            
            if (count($tables) > 0) {
                $this->info('Tables:');
                foreach ($tables as $table) {
                    $tableName = get_object_vars($table)[key(get_object_vars($table))];
                    $this->line('  - ' . $tableName);
                }
            }
            
            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->error('✗ Failed to connect to database!');
            $this->error('Error: ' . $e->getMessage());
            
            $this->info('');
            $this->info('Check your database configuration in .env file:');
            $this->line('  DB_CONNECTION=' . config('database.default'));
            $this->line('  DB_HOST=' . config('database.connections.' . config('database.default') . '.host'));
            $this->line('  DB_PORT=' . config('database.connections.' . config('database.default') . '.port'));
            $this->line('  DB_DATABASE=' . config('database.connections.' . config('database.default') . '.database'));
            
            return Command::FAILURE;
        }
    }
}