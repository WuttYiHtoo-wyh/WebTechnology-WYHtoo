<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Student;
use App\Models\Attendance;
use Carbon\Carbon;

class AttendanceSeeder extends Seeder
{
    public function run()
    {
        $students = Student::all();
        $today = Carbon::now();

        foreach ($students as $student) {
            // Generate attendance for the last 30 days
            for ($i = 30; $i >= 0; $i--) {
                $date = $today->copy()->subDays($i);
                
                // Skip weekends
                if ($date->isWeekend()) {
                    continue;
                }

                // 85% chance of being present
                $status = (rand(1, 100) <= 85) ? 'present' : 'absent';

                Attendance::create([
                    'student_id' => $student->id,
                    'date' => $date,
                    'status' => $status,
                    'remarks' => $status === 'absent' ? 'Absent from class' : null,
                ]);
            }
        }
    }
} 