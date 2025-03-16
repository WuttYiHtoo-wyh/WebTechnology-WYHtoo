<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateModulesTable extends Migration
{
    public function up()
    {
        Schema::create('modules', function (Blueprint $table) {
            $table->id('module_id'); // This creates bigint unsigned
            $table->string('module_name', 100);
            $table->string('term', 20);
            $table->date('start_date');
            $table->date('end_date');
            $table->integer('credits')->default(3);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('modules');
    }
}
