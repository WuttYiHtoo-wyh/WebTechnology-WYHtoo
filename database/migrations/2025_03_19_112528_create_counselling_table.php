<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('counselling', function (Blueprint $table) {
            $table->id();
            $table->string('ticket_id', 50);
            $table->unsignedBigInteger('learner_id');
            $table->unsignedBigInteger('mentor_id');
            $table->date('date');
            $table->text('notes');
            $table->timestamps();

            $table->foreign('learner_id')->references('id')->on('students')->onDelete('cascade');
            $table->foreign('mentor_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('counselling');
    }
}; 