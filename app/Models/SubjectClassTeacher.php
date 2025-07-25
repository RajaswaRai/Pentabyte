<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubjectClassTeacher extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function subject() {
        return $this->belongsTo(Subject::class, 'subject_id', 'id');
    }
    public function classroom() {
        return $this->belongsTo(Classroom::class, 'classroom_id', 'id');
    }
    public function teacher() {
        return $this->belongsTo(Teacher::class, 'teacher_id', 'id');
    }
    public function absences() {
        return $this->hasMany(Absence::class, 'subject_class_teacher_id', 'id');
    }
}
