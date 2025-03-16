<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call([
            ModuleSeeder::class,
            StudentSeeder::class,
            AttendanceSeeder::class,
            GradeSeeder::class,
            MentorSeeder::class,
            MentoringSessionSeeder::class,
            ReminderSeeder::class,
            CounselingCallSeeder::class,
        ]);
    }
}