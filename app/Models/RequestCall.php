<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RequestCall extends Model
{
    use HasFactory;

    protected $table = 'requestcall';

    protected $fillable = [
        'student_id',
        'mentor_id',
        'reason',
        'preferred_date',
        'additional_notes',
        'status'
    ];

    protected $casts = [
        'preferred_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function mentor()
    {
        return $this->belongsTo(Mentor::class);
    }
} 