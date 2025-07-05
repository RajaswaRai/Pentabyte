<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LessonComment;
use Illuminate\Http\Request;

class ClassroomsController extends Controller
{
    public function lesson_comments(Request $request, $lesson_id) {
        $comments = LessonComment::where('lesson_id', $lesson_id)->get();

        return $comments;
    }
}
