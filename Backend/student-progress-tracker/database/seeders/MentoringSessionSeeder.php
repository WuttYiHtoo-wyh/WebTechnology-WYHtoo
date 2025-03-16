<?php

namespace Database\Seeders;

use App\Models\MentoringSession;
use App\Models\Student;
use App\Models\Mentor;
use Illuminate\Database\Seeder;

class MentoringSessionSeeder extends Seeder
{
    public function run()
    {
        $students = Student::all();
        $mentors = Mentor::all();

        foreach ($students as $student) {
            foreach ($mentors as $mentor) {
                MentoringSession::create([
                    'student_id' => $student->student_id,
                    'mentor_id' => $mentor->mentor_id,
                    'start_date' => '2025-03-14 10:00:00',
                    'end_date' => '2025-03-14 11:00:00',
                    'notes' => 'Sample mentoring session note',
                ]);
            }
        }
    }
}