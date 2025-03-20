<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Module;
use Carbon\Carbon;

class ModuleSeeder extends Seeder
{
    public function run()
    {
        $modules = [
            [
                'code' => 'WEB001',
                'name' => 'Web Development Fundamentals',
                'description' => 'Introduction to HTML, CSS, and JavaScript',
                'credits' => 3,
                'semester' => 1,
                'program' => 'MSc Web Technology',
                'start_date' => Carbon::now()->subMonths(2),
                'end_date' => Carbon::now()->addMonths(4),
            ],
            [
                'code' => 'WEB002',
                'name' => 'Advanced Web Technologies',
                'description' => 'Modern frameworks and backend development',
                'credits' => 4,
                'semester' => 1,
                'program' => 'MSc Web Technology',
                'start_date' => Carbon::now()->subMonths(1),
                'end_date' => Carbon::now()->addMonths(5),
            ],
            [
                'code' => 'WEB003',
                'name' => 'Full Stack Development',
                'description' => 'End-to-end web application development',
                'credits' => 4,
                'semester' => 2,
                'program' => 'MSc Web Technology',
                'start_date' => Carbon::now(),
                'end_date' => Carbon::now()->addMonths(6),
            ],
            [
                'code' => 'WEB004',
                'name' => 'Web Security',
                'description' => 'Security principles and best practices',
                'credits' => 3,
                'semester' => 2,
                'program' => 'MSc Web Technology',
                'start_date' => Carbon::now()->addMonths(1),
                'end_date' => Carbon::now()->addMonths(7),
            ],
            [
                'code' => 'WEB005',
                'name' => 'Cloud Computing',
                'description' => 'Cloud platforms and deployment',
                'credits' => 3,
                'semester' => 3,
                'program' => 'MSc Web Technology',
                'start_date' => Carbon::now()->addMonths(2),
                'end_date' => Carbon::now()->addMonths(8),
            ],
        ];

        foreach ($modules as $module) {
            Module::create($module);
        }
    }
} 