<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCounselingCallsTable extends Migration
{
    public function up()
    {
        Schema::create('counseling_calls', function (Blueprint $table) {
            $table->id('call_id');
            $table->unsignedBigInteger('student_id');
            $table->foreign('student_id')->references('student_id')->on('students')->onDelete('cascade');
            $table->dateTime('date_scheduled');
            $table->enum('status', ['scheduled', 'completed', 'missed'])->default('scheduled');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('counseling_calls');
    }
}