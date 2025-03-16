<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class MentoringSession extends Model
{
    protected $primaryKey = 'session_id';
    protected $fillable = ['student_id', 'mentor_id', 'start_date', 'end_date', 'notes'];

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }

    public function mentor()
    {
        return $this->belongsTo(Mentor::class, 'mentor_id');
    }
}