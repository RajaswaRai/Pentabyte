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
        Schema::create('lesson_comments', function (Blueprint $table) {
            $table->id();
            $table->text('content');
            $table->foreignId('user_id')->nullable()->constrained('users', 'id')->nullOnDelete();
            $table->foreignId('lesson_id')->nullable()->constrained('lessons', 'id')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lesson_comments');
    }
};
