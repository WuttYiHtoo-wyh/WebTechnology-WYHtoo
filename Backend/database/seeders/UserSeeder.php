<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Create admin users
        $admins = [
            [
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'password' => password_hash('password123', PASSWORD_DEFAULT),
                'role' => 'admin',
            ],
        ];

        foreach ($admins as $admin) {
            User::create($admin);
        }

        // Create mentor users
        $mentors = [
            [
                'name' => 'Dr. Sarah Johnson',
                'email' => 'mentor@example.com',
                'password' => password_hash('password123', PASSWORD_DEFAULT),
                'role' => 'mentor',
            ],
            [
                'name' => 'Prof. Michael Chen',
                'email' => 'michael.mentor@example.com',
                'password' => password_hash('password123', PASSWORD_DEFAULT),
                'role' => 'mentor',
            ],
            [
                'name' => 'Dr. Emily Brown',
                'email' => 'emily.mentor@example.com',
                'password' => password_hash('password123', PASSWORD_DEFAULT),
                'role' => 'mentor',
            ],
        ];

        foreach ($mentors as $mentor) {
            User::create($mentor);
        }
    }
} 