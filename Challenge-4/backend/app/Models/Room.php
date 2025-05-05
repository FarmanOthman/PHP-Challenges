<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Room extends Model
{
    use HasFactory, SoftDeletes;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'type',
        'created_by',
        'is_private',
    ];
    
    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_private' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
    
    /**
     * Get the user who created this room.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
    
    /**
     * Get the messages for this room.
     */
    public function messages()
    {
        return $this->morphMany(Message::class, 'recipient');
    }
    
    /**
     * Get the users that are members of this room.
     */
    public function members()
    {
        return $this->belongsToMany(User::class, 'room_user')
                    ->withTimestamps()
                    ->withPivot('is_admin');
    }
}
