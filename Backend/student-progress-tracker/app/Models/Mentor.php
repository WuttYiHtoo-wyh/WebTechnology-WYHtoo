<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Mentor extends Model
{
    protected $primaryKey = 'mentor_id';
    protected $fillable = ['name', 'email'];

    public function mentoringSessions()
    {
        return $this->hasMany(MentoringSession::class, 'mentor_id');
    }
}