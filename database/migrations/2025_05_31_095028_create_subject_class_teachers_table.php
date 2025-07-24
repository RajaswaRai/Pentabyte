<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('subject_class_teachers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subject_id')->nullable()->constrained('subjects', 'id')->cascadeOnDelete();
            $table->foreignId('classroom_id')->nullable()->constrained('classrooms', 'id')->cascadeOnDelete();
            $table->foreignId('teacher_id')->nullable()->constrained('teachers', 'id')->cascadeOnDelete();
            $table->enum('day', [0,1,2,3,4,5,6]);
            $table->time('start_time');
            $table->time('end_time');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subject_class_teachers');
    }
};
