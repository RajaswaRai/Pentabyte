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
        Schema::create('absences', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            // 0 hadir, 1 izin, 2 alpha, 3 sakit
            $table->enum('status', [0, 1, 2, 3]);
            $table->foreignId('student_id')->nullable()->constrained('students', 'id')->cascadeOnDelete();
            $table->foreignId('subject_class_teacher_id')->constrained('subject_class_teachers', 'id')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('absences');
    }
};
