<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class UpdateUserPasswords extends Migration
{
    public function up()
    {
        // Update admin password
        DB::table('users')
            ->where('email', 'admin1@example.com')
            ->update(['password' => 'admin123']);

        // Update student password
        DB::table('users')
            ->where('email', 'polen5005@gmail.com')
            ->update(['password' => 'student123']);
    }

    public function down()
    {
        // If needed, revert to original passwords
    }
} 