<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class MentorUserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Mentor User',
            'email' => 'mentor@example.com',
            'password' => password_hash('password123', PASSWORD_DEFAULT),
            'role' => 'mentor',
            'phone' => '1234567890',
            'address' => 'Mentor Address',
        ]);
    }
} 