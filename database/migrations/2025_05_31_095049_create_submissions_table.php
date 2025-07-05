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
        Schema::create('submissions', function (Blueprint $table) {
            $table->id();
            $table->string('grade');
            $table->string('feedback');
            $table->dateTime('submitted_at');
            $table->foreignId('student_id')->nullable()->constrained('students', 'id')->nullOnDelete();
            $table->foreignId('assignment_id')->nullable()->constrained('assignments', 'id')->cascadeOnDelete();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('submissions');
    }
};
