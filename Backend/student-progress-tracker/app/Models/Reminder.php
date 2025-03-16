<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Reminder extends Model
{
    protected $primaryKey = 'reminder_id';
    protected $fillable = ['student_id', 'date_sent', 'message', 'status'];

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }
}