<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UpdateMentorEmailSeeder extends Seeder
{
    public function run(): void
    {
        // Update the mentor's email
        DB::table('users')
            ->where('id', 5)
            ->where('name', 'WuttYi')
            ->update(['email' => 'htoowuttyi@gmail.com']);

        echo "Mentor email updated successfully.\n";
    }
} 