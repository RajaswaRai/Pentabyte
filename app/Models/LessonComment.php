<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LessonComment extends Model
{
    use HasFactory;

    public function lesson() {
        return $this->belongsTo(Lesson::class, 'lesson_id', 'id');
    }
}
