<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update the mentor's email
        DB::table('users')
            ->where('id', 5)
            ->where('name', 'WuttYi')
            ->update(['email' => 'htoowuttyi@gmail.com']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert the email back to the original
        DB::table('users')
            ->where('id', 5)
            ->where('name', 'WuttYi')
            ->update(['email' => 'mentor1@example.com']);
    }
}; 