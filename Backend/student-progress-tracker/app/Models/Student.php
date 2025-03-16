<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $primaryKey = 'student_id';
    protected $fillable = ['name', 'email', 'phone', 'enrollment_date', 'status'];

    public function attendance()
    {
        return $this->hasMany(Attendance::class, 'student_id', 'student_id');
    }

    public function grades()
    {
        return $this->hasMany(Grade::class, 'student_id', 'student_id');
    }

    public function mentoringSessions()
    {
        return $this->hasMany(MentoringSession::class, 'student_id', 'student_id');
    }

    public function reminders()
    {
        return $this->hasMany(Reminder::class, 'student_id', 'student_id');
    }

    public function counselingCalls()
    {
        return $this->hasMany(CounselingCall::class, 'student_id', 'student_id');
    }
}