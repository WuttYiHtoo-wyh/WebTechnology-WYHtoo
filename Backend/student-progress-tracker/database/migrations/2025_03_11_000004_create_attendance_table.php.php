<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAttendanceTable extends Migration
{
    public function up()
    {
        Schema::create('attendance', function (Blueprint $table) {
            $table->id('attendance_id'); // INT PRIMARY KEY AUTO_INCREMENT
            $table->unsignedBigInteger('student_id'); // Foreign key to students table
            $table->unsignedBigInteger('module_id'); // Foreign key to modules table
            $table->date('date'); // DATE NOT NULL
            $table->enum('status', ['present', 'absent', 'excused'])->default('absent');
            $table->string('notes', 255)->nullable(); // Optional notes for attendance
            $table->timestamps();

            // Define foreign key constraints
            $table->foreign('student_id')->references('student_id')->on('students')->onDelete('cascade');
            $table->foreign('module_id')->references('module_id')->on('modules')->onDelete('cascade');
        });

        // Add an index for the student_id and date columns
        Schema::table('attendance', function (Blueprint $table) {
            $table->index(['student_id', 'date'], 'idx_attendance_student_date');
        });
    }

    public function down()
    {
        Schema::dropIfExists('attendance');
    }
}
