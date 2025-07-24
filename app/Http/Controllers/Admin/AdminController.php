<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\Major;
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
    
    public function major(Request $request) {

        $majors = Major::all();

        return Inertia::render('Admin/MajorPage', compact('majors'));
    }
    
    public function classroom(Request $request) {

        $semesters = Semester::all();
        $classrooms = Classroom::with('semester', 'major', 'homeroom')->get();
        $teachers = Teacher::all();
        $majors = Major::all();
        $noclass_students = Student::where('classroom_id', NULL)->get();

        return Inertia::render('Admin/ClassroomPage', compact('classrooms', 'majors', 'teachers', 'semesters', 'noclass_students'));
    }
    public function classroom_show(Request $request, Classroom $classroom) {

        $classroom->load('students', 'homeroom');
        $classrooms = Classroom::all();
        $student_select = Student::where('classroom_id', NULL)->get();

        return Inertia::render('Admin/ClassroomShowPage', compact('classroom', 'classrooms', 'student_select'));
    }
    
    public function teacher(Request $request) {

        $teachers = User::with('teacher')->whereHas('teacher')->get();

        return Inertia::render('Admin/TeacherPage', compact('teachers'));
    }
   
    public function student(Request $request) {

        $students = User::with('student.major')->whereHas('student')->get();
        $majors = Major::all();

        return Inertia::render('Admin/StudentPage', compact('students', 'majors'));
    }
    public function student_show(Request $request, Student $student) {

        $student->load('user');

        return Inertia::render('Admin/StudentShowPage', compact('student'));
    }
  
    public function schedule(Request $request) {

        $semesters = Semester::all();
        $classrooms = Classroom::with('semester')->get();

        return Inertia::render('Admin/SchedulePage', compact('classrooms', 'semesters'));
    }
    public function schedule_show(Request $request, Classroom $classroom) {

        $classroom->load([
            'semester', 
            'subjectClassTeacher', 
            'subjectClassTeacher.subject',
            'subjectClassTeacher.teacher',
        ]);
        $subjects = Subject::all();
        $teachers = Teacher::all(); 
        return Inertia::render('Admin/ScheduleShowPage', compact('classroom', 'subjects', 'teachers'));
    }
    
    public function semester(Request $request) {
        
        $semesters = Semester::all();

        return Inertia::render('Admin/SemesterPage', compact('semesters'));
    }
    
    public function users(Request $request) {
        return Inertia::render('Admin/UserPage');
    }
}
