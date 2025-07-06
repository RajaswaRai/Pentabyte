<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\Semester;
use App\Models\Student;
use App\Models\Subject;
use App\Models\SubjectClassTeacher;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index(Request $request) {
        return Inertia::render('Admin/DashboardPage');
    }
    
    public function subject(Request $request) {

        $subjects = Subject::all();

        return Inertia::render('Admin/SubjectPage', compact('subjects'));
    }
    
    public function classroom(Request $request) {

        $classrooms = Classroom::with('homeroom')->get();
        $teachers = Teacher::all();

        return Inertia::render('Admin/ClassroomPage', compact('classrooms', 'teachers'));
    }
    public function classroom_show(Request $request, Classroom $classroom) {

        $classroom->load('students', 'homeroom');
        $student_select = Student::where('classroom_id', NULL)->get();

        return Inertia::render('Admin/ClassroomShowPage', compact('classroom', 'student_select'));
    }
    
    public function teacher(Request $request) {

        $teachers = User::with('teacher')->whereHas('teacher')->get();

        return Inertia::render('Admin/TeacherPage', compact('teachers'));
    }
   
    public function student(Request $request) {

        $students = User::with('student')->whereHas('student')->get();

        return Inertia::render('Admin/StudentPage', compact('students'));
    }
  
    public function schedule(Request $request) {

        $schedules = SubjectClassTeacher::all();

        return Inertia::render('Admin/SchedulePage', compact('schedules'));
    }
    
    public function semester(Request $request) {
        
        $semesters = Semester::all();

        return Inertia::render('Admin/SemesterPage', compact('semesters'));
    }
    
    public function users(Request $request) {
        return Inertia::render('Admin/UserPage');
    }
}
