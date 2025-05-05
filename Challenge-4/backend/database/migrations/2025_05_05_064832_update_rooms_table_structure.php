<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add missing columns to the rooms table
        Schema::table('rooms', function (Blueprint $table) {
            // Only add columns if they don't exist
            if (!Schema::hasColumn('rooms', 'name')) {
                $table->string('name')->after('id');
            }
            
            if (!Schema::hasColumn('rooms', 'description')) {
                $table->text('description')->nullable()->after('name');
            }
            
            if (!Schema::hasColumn('rooms', 'type')) {
                $table->string('type')->default('public')->comment('public, private, direct')->after('description');
            }
            
            if (!Schema::hasColumn('rooms', 'created_by')) {
                $table->foreignId('created_by')->constrained('users')->after('type');
            }
            
            if (!Schema::hasColumn('rooms', 'is_private')) {
                $table->boolean('is_private')->default(false)->after('created_by');
            }
            
            if (!Schema::hasColumn('rooms', 'deleted_at')) {
                $table->softDeletes();
            }
        });

        // Create room_user pivot table if it doesn't exist
        if (!Schema::hasTable('room_user')) {
            Schema::create('room_user', function (Blueprint $table) {
                $table->id();
                $table->foreignId('room_id')->constrained()->onDelete('cascade');
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->boolean('is_admin')->default(false);
                $table->timestamps();

                $table->unique(['room_id', 'user_id']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop the room_user table
        Schema::dropIfExists('room_user');
        
        // Remove the added columns from rooms table
        Schema::table('rooms', function (Blueprint $table) {
            $table->dropSoftDeletes();
            $table->dropColumn(['name', 'description', 'type', 'created_by', 'is_private']);
        });
    }
};
