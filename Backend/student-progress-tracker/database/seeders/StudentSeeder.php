<?php

namespace Database\Seeders;

use App\Models\Student;
use Illuminate\Database\Seeder;

class StudentSeeder extends Seeder
{
    public function run()
    {
        Student::create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'enrollment_date' => '2025-01-01',
            'status' => 'active',
        ]);
        Student::create([
            'name' => 'Alice Johnson',
            'email' => 'alice@example.com',
            'enrollment_date' => '2025-01-02',
            'status' => 'active',
        ]);
        Student::create([
            'name' => 'Bob Smith',
            'email' => 'bob@example.com',
            'enrollment_date' => '2025-01-03',
            'status' => 'inactive',
        ]);
    }
}