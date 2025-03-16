<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGradesTable extends Migration
{
    public function up()
    {
        Schema::create('grades', function (Blueprint $table) {
            $table->id('grade_id'); // INT PRIMARY KEY AUTO_INCREMENT
            $table->unsignedBigInteger('student_id'); // Foreign key to students table
            $table->unsignedBigInteger('module_id'); // Foreign key to modules table
            $table->decimal('grade', 5, 2)->nullable(); // Decimal grade value
            $table->date('submission_date'); // Date of grade submission
            $table->timestamps();

            // Define foreign key constraints
            $table->foreign('student_id')->references('student_id')->on('students')->onDelete('cascade');
            $table->foreign('module_id')->references('module_id')->on('modules')->onDelete('cascade');
        });

        // Add an index for the student_id and module_id columns
        Schema::table('grades', function (Blueprint $table) {
            $table->index(['student_id', 'module_id'], 'idx_grades_student_module');
        });
    }

    public function down()
    {
        Schema::dropIfExists('grades');
    }
}
