<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMentorsTable extends Migration
{
    public function up()
    {
        Schema::create('mentors', function (Blueprint $table) {
            $table->id('mentor_id'); // INT PRIMARY KEY AUTO_INCREMENT
            $table->string('name', 100); // VARCHAR(100) NOT NULL
            $table->string('email', 100)->unique(); // VARCHAR(100) NOT NULL UNIQUE
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('mentors');
    }
}