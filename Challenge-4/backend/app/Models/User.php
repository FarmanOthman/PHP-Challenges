<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'is_admin',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_admin' => 'boolean',
        ];
    }
    
    /**
     * Check if the user is an admin.
     *
     * @return bool
     */
    public function isAdmin(): bool
    {
        return $this->is_admin === true;
    }
    
    /**
     * Get the messages sent by the user.
     */
    public function sentMessages()
    {
        return $this->hasMany(Message::class, 'user_id');
    }
    
    /**
     * Get messages received by this user.
     */
    public function receivedMessages()
    {
        return $this->hasMany(Message::class, 'recipient_id')
                    ->where('recipient_type', 'user');
    }
    
    /**
     * Get unread messages received by this user.
     */
    public function unreadMessages()
    {
        return $this->receivedMessages()->unread();
    }
    
    /**
     * Get the rooms created by this user.
     */
    public function createdRooms()
    {
        return $this->hasMany(Room::class, 'created_by');
    }
    
    /**
     * Get the rooms this user is a member of.
     */
    public function rooms()
    {
        return $this->belongsToMany(Room::class, 'room_user')
                    ->withTimestamps()
                    ->withPivot('is_admin');
    }
    
    /**
     * Check if the user is a member of a specific room.
     *
     * @param int $roomId
     * @return bool
     */
    public function isMemberOfRoom(int $roomId): bool
    {
        return $this->rooms()->where('rooms.id', $roomId)->exists();
    }
    
    /**
     * Check if the user is an admin of a specific room.
     *
     * @param int $roomId
     * @return bool
     */
    public function isRoomAdmin(int $roomId): bool
    {
        return $this->rooms()
                    ->where('rooms.id', $roomId)
                    ->wherePivot('is_admin', true)
                    ->exists();
    }
}
