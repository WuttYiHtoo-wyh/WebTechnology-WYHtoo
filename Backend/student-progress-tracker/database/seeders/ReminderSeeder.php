<?php

namespace Database\Seeders;

use App\Models\Reminder;
use App\Models\Student;
use Illuminate\Database\Seeder;

class ReminderSeeder extends Seeder
{
    public function run()
    {
        $students = Student::all();

        foreach ($students as $student) {
            Reminder::create([
                'student_id' => $student->student_id,
                'date_sent' => '2025-03-14 12:00:00',
                'message' => 'Reminder for assignment submission',
                'status' => 'sent',
            ]);
        }
    }
}