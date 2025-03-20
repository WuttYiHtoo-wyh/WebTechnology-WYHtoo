<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Student;
use App\Models\User;
use App\Models\Module;

class StudentSeeder extends Seeder
{
    public function run()
    {
        // Get all modules
        $modules = Module::all();
        
        // Create student users first
        $students = [
            [
                'name' => 'John Smith',
                'email' => 'john@example.com',
                'password' => password_hash('password123', PASSWORD_DEFAULT),
                'role' => 'student',
            ],
            [
                'name' => 'Emma Wilson',
                'email' => 'emma@example.com',
                'password' => password_hash('password123', PASSWORD_DEFAULT),
                'role' => 'student',
            ],
            [
                'name' => 'Michael Brown',
                'email' => 'michael@example.com',
                'password' => password_hash('password123', PASSWORD_DEFAULT),
                'role' => 'student',
            ],
            [
                'name' => 'Sarah Davis',
                'email' => 'sarah@example.com',
                'password' => password_hash('password123', PASSWORD_DEFAULT),
                'role' => 'student',
            ],
            [
                'name' => 'James Johnson',
                'email' => 'james@example.com',
                'password' => password_hash('password123', PASSWORD_DEFAULT),
                'role' => 'student',
            ],
        ];

        foreach ($students as $studentData) {
            $user = User::create($studentData);
            
            // Create student record with random module assignment
            Student::create([
                'user_id' => $user->id,
                'student_id' => 'ST' . str_pad(rand(1, 99999), 5, '0', STR_PAD_LEFT),
                'program' => 'MSc Web Technology',
                'semester' => rand(1, 3),
                'cgpa' => number_format(rand(250, 400) / 100, 2),
                'academic_status' => rand(0, 1) ? 'Good Standing' : 'Academic Probation',
                'intervention_plan' => null,
                'module_id' => $modules->random()->id,
            ]);
        }
    }
} 