<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMentoringSessionsTable extends Migration
{
    public function up()
    {
        Schema::create('mentoring_sessions', function (Blueprint $table) {
            $table->id('session_id');
            $table->unsignedBigInteger('student_id');
            $table->foreign('student_id')->references('student_id')->on('students')->onDelete('cascade');
            $table->unsignedBigInteger('mentor_id')->nullable();
            $table->foreign('mentor_id')->references('mentor_id')->on('mentors')->onDelete('set null');
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('mentoring_sessions');
    }
}