<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LessonComment extends Model
{
    use HasFactory;

    protected $fillable = [
        'content',
        'user_id',
        'lesson_id',
    ];

    public function lesson()
    {
        return $this->belongsTo(Lesson::class, 'lesson_id', 'id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

