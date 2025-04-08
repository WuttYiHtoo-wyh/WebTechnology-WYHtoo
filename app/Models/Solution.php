<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Solution extends Model
{
    use HasFactory;

    protected $fillable = [
        'counselling_id',
        'mentor_id',
        'problem_description',
        'solution_description',
        'date_resolved',
        'status'
    ];

    protected $casts = [
        'date_resolved' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function counselling()
    {
        return $this->belongsTo(Counselling::class);
    }

    public function mentor()
    {
        return $this->belongsTo(User::class, 'mentor_id');
    }
} 