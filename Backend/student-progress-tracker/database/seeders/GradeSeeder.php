<?php

namespace Database\Seeders;

use App\Models\Grade;
use App\Models\Student;
use App\Models\Module;
use Illuminate\Database\Seeder;

class GradeSeeder extends Seeder
{
    public function run()
    {
        $students = Student::all();
        $modules = Module::all();

        foreach ($students as $student) {
            foreach ($modules as $module) {
                Grade::create([
                    'student_id' => $student->student_id,
                    'module_id' => $module->module_id,
                    'grade' => rand(50, 100) + (rand(0, 99) / 100), // Random grade between 50.00 and 100.00
                ]);
            }
        }
    }
}