<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function assignment() {
        return $this->hasOne(Assignment::class, 'lesson_id', 'id');
    }

    public function subjectClassroomTeacher() {
        return $this->belongsTo(SubjectClassTeacher::class, 'subject_class_teacher_id', 'id');
    }

    public function lessonComments() {
        return $this->hasMany(LessonComment::class, 'lesson_id', 'id');
    }
}
