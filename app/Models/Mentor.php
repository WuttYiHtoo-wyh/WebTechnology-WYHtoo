<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Mentor extends Model
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'specialization',
        'availability'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function counselingRequests()
    {
        return $this->hasMany(RequestCall::class);
    }
} 