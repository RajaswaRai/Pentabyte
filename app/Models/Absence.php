<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Absence extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function student() {
        return $this->belongsTo(Student::class, 'student_id', 'id');
    }

    public function subjectClassTeacher() {
        return $this->belongsTo(SubjectClassTeacher::class, 'subject_class_teacher_id', 'id');
    }
}
