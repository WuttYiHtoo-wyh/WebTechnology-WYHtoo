<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'student_id',
        'program',
        'semester',
        'cgpa',
        'academic_status',
        'intervention_plan',
        'module_id',
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
}
