<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Semester extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function subjectClassTeachers() {
        return $this->hasMany(SubjectClassTeacher::class, 'semester_id', 'id');
    }
}
