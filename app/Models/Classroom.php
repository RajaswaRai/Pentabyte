<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Classroom extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function subjectClassTeacher() {
        return $this->hasMany(SubjectClassTeacher::class, 'classroom_id', 'id');
    }

    public function homeroom() {
        return $this->belongsTo(Teacher::class, 'homeroom_teacher_id', 'id');
    }

    public function students() {
        return $this->hasMany(Student::class, 'classroom_id', 'id');
    }
    
    public function semester() {
        return $this->belongsTo(Semester::class, 'semester_id', 'id');
    }
}
