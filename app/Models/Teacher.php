<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function classroom() {
        return $this->hasOne(Classroom::class, 'homeroom_teacher_id', 'id');
    }
   
    public function user() {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
