<?php

namespace Database\Seeders;

use App\Models\Module;
use Illuminate\Database\Seeder;

class ModuleSeeder extends Seeder
{
    public function run()
    {
        Module::create([
            'module_name' => 'Mathematics',
            'term' => 'Spring 2025',
            'start_date' => '2025-01-01',
            'end_date' => '2025-05-01',
            'credits' => 3,
        ]);
        Module::create([
            'module_name' => 'Physics',
            'term' => 'Spring 2025',
            'start_date' => '2025-01-01',
            'end_date' => '2025-05-01',
            'credits' => 4,
        ]);
        Module::create([
            'module_name' => 'Computer Science',
            'term' => 'Spring 2025',
            'start_date' => '2025-01-01',
            'end_date' => '2025-05-01',
            'credits' => 3,
        ]);
    }
}