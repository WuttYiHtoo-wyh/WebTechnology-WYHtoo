<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStudentsTable extends Migration
{
    public function up()
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id('student_id'); // INT PRIMARY KEY AUTO_INCREMENT
            $table->string('name', 100); // VARCHAR(100) NOT NULL
            $table->string('email', 100)->unique(); // VARCHAR(100) NOT NULL UNIQUE
            $table->string('phone', 20)->nullable(); // VARCHAR(20)
            $table->date('enrollment_date'); // DATE NOT NULL
            $table->enum('status', ['active', 'inactive', 'graduated'])->default('active');
            $table->timestamps(); // Adds created_at and updated_at
        });

        // Add an index for the email column
        Schema::table('students', function (Blueprint $table) {
            $table->index('email', 'idx_students_email');
        });
    }

    public function down()
    {
        Schema::dropIfExists('students');
    }
}
