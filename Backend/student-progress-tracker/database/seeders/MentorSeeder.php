<?php

namespace Database\Seeders;

use App\Models\Mentor;
use Illuminate\Database\Seeder;

class MentorSeeder extends Seeder
{
    public function run()
    {
        Mentor::create([
            'name' => 'Jane Smith',
            'email' => 'jane@example.com',
        ]);
        Mentor::create([
            'name' => 'Michael Brown',
            'email' => 'michael@example.com',
        ]);
    }
}