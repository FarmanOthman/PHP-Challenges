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
        // Add indexes to messages table
        Schema::table('messages', function (Blueprint $table) {
            // Add indexes for frequently queried columns
            $table->index(['recipient_id', 'recipient_type']); // For querying messages by recipient
            $table->index(['user_id', 'created_at']); // For querying user's messages with timestamp
            $table->index(['is_read', 'recipient_type']); // For querying unread messages
            $table->index('deleted_at'); // For soft deletes queries
        });

        // Add indexes to room_user pivot table
        Schema::table('room_user', function (Blueprint $table) {
            // Add index for user's room membership queries
            $table->index(['user_id', 'is_admin']); // For querying user's rooms with admin status
        });

        // Add indexes to rooms table
        Schema::table('rooms', function (Blueprint $table) {
            $table->index(['type', 'is_private']); // For filtering rooms by type and privacy
            $table->index('created_by'); // For querying rooms by creator
            $table->index('deleted_at'); // For soft deletes queries
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove indexes from messages table
        Schema::table('messages', function (Blueprint $table) {
            $table->dropIndex(['recipient_id', 'recipient_type']);
            $table->dropIndex(['user_id', 'created_at']);
            $table->dropIndex(['is_read', 'recipient_type']);
            $table->dropIndex(['deleted_at']);
        });

        // Remove indexes from room_user pivot table
        Schema::table('room_user', function (Blueprint $table) {
            $table->dropIndex(['user_id', 'is_admin']);
        });

        // Remove indexes from rooms table
        Schema::table('rooms', function (Blueprint $table) {
            $table->dropIndex(['type', 'is_private']);
            $table->dropIndex(['created_by']);
            $table->dropIndex(['deleted_at']);
        });
    }
};