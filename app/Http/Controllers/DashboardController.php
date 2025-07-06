<?php

namespace App\Http\Controllers;

use App\Constants\UserRole;
use App\Http\Controllers\Admin\AdminController;
use App\Models\LessonComment;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request) {
        
        switch ($request->user()->role) {
            case UserRole::STUDENT:
                return (new StudentController)->index($request);
            case UserRole::TEACHER:
                return (new TeacherController)->index($request);
            case UserRole::GUARDIAN:
                return (new StudentController)->index($request);
            default:
                return;
        }
    }
    
    public function subject(Request $request, $id) {
        
        switch ($request->user()->role) {
            case UserRole::ADMIN:
                return (new AdminController)->subject($request, $id);
            case UserRole::STUDENT:
                return (new StudentController)->subject($request, $id);
            case UserRole::TEACHER:
                return (new TeacherController)->subject($request, $id);
            case UserRole::GUARDIAN:
                return (new StudentController)->subject($request, $id);
            default:
                break;
        }
    }

    public function assignments(Request $request) {

        switch ($request->user()->role) {
            case UserRole::ADMIN:
                return (new AdminController)->assignments($request);
            case UserRole::STUDENT:
                return (new StudentController)->assignments($request);
            case UserRole::TEACHER:
                return (new TeacherController)->assignments($request);
            case UserRole::GUARDIAN:
                return (new StudentController)->assignments($request);
            default:
                break;
        }
    }
    
    public function assignment(Request $request, $lesson_id, $assignment_id) {

        switch ($request->user()->role) {
            case UserRole::ADMIN:
                return (new AdminController)->assignment($request, $lesson_id, $assignment_id);
            case UserRole::STUDENT:
                return (new StudentController)->assignment($request, $lesson_id, $assignment_id);
            case UserRole::TEACHER:
                return (new TeacherController)->assignment($request, $lesson_id, $assignment_id);
            case UserRole::GUARDIAN:
                return (new StudentController)->assignment($request, $lesson_id, $assignment_id);
            default:
                break;
        }
    }

    public function comments($lesson_id) {
        // If not AJAX, redirect based on auth status
        if (!request()->ajax() && request()->header('X-Requested-With') !== 'XMLHttpRequest') {
            return auth()->check()
                ? redirect()->route('dashboard') // or whatever your logged-in dashboard route is
                : redirect('/'); // for guests
        }

        // AJAX request – return JSON response with comments
        $comments = LessonComment::with(['lesson', 'user'])
            ->where('lesson_id', $lesson_id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'id' => $lesson_id,
            'comments' => $comments,
        ]);
    }
    public function storeComment(Request $request, $lesson_id)
    {
        $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        LessonComment::create([
            'content' => $request->content,
            'user_id' => auth()->id(),
            'lesson_id' => $lesson_id,
        ]);

        return back(303);
    }



}
