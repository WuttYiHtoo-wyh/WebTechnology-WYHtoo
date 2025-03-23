<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Counselling extends Model
{
    use HasFactory;

    protected $table = 'counselling';

    protected $fillable = [
        'ticket_id',
        'student_id',
        'mentor_id',
        'date',
        'notes',
        'created_at',
        'updated_at'
    ];

    protected $casts = [
        'date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function mentor()
    {
        return $this->belongsTo(User::class, 'mentor_id');
    }
}
