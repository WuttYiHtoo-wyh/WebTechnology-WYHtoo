<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class CounselingCall extends Model
{
    protected $primaryKey = 'call_id';
    protected $fillable = ['student_id', 'date_scheduled', 'status', 'notes'];

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }
}