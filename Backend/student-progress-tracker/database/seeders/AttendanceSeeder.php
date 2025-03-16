<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\Student;
use App\Models\Module;
use Illuminate\Database\Seeder;

class AttendanceSeeder extends Seeder
{
    public function run()
    {
        $students = Student::all();
        $modules = Module::all();

        foreach ($students as $student) {
            foreach ($modules as $module) {
                Attendance::create([
                    'student_id' => $student->student_id,
                    'module_id' => $module->module_id,
                    'date' => '2025-03-14',
                    'status' => rand(0, 1) ? 'present' : 'absent',
                    'notes' => 'Sample attendance note',
                ]);
            }
        }
    }
}