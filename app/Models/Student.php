<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;

class Student extends Model
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'user_id',
        'student_id',
        'program',
        'semester',
        'cgpa',
        'academic_status',
        'intervention_plan',
        'module_id',
        'phone',
        'address',
        'date_of_birth',
        'gender',
        'status'
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'enrollment_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    public function progress()
    {
        return $this->hasMany(Progress::class);
    }

    public function counsellings()
    {
        return $this->hasMany(Counselling::class);
    }

    public function counselingRequests()
    {
        return $this->hasMany(RequestCall::class, 'student_id');
    }
}
