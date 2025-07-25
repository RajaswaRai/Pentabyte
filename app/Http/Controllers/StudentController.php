<?php

namespace App\Http\Controllers;

use App\Constants\SemesterType;
use App\Models\Absence;
use App\Models\Assignment;
use App\Models\Lesson;
use App\Models\LessonComment;
use App\Models\SubjectClassTeacher;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index(Request $request) {
        $sct = SubjectClassTeacher::with('subject', 'classroom', 'teacher')
            ->where('classroom_id', $request->user()->student->classroom_id)
            ->get();

        // (0 = Sunday, 1 = Monday)
        $dayIndex = Carbon::now()->dayOfWeek;
        $assignments = Assignment::with('lesson')
        ->whereHas('lesson', function ($query) use ($sct, $request) {
            $query->whereIn('subject_class_teacher_id', $sct->pluck('id')->unique());
            $query->whereHas('subjectClassroomTeacher', function ($q) use ($request) {
                $q->where('classroom_id', $request->user()->student->classroom_id);
            });
        })
        ->whereDate('due_date', '>', Carbon::today()) 
        ->get();
            
        return Inertia::render('Student/DashboardPage', compact('sct', 'assignments'));
    }

    public function subject(Request $request, $id) {
        $sct = SubjectClassTeacher::with('subject', 'classroom.students', 'classroom.semester', 'teacher', 'absences')
        ->where('id', $id)
        ->firstOrFail();

        $class_students_count = $sct->classroom->students->count();
        $semester = $sct->classroom->semester;
        $academic_periode = SemesterType::name($semester->semester_type, $semester->academic_year);

        $classroom_id = $sct->classroom_id;

        $lessons = Lesson::with('subjectClassroomTeacher.teacher', 'assignment')
        ->where('subject_class_teacher_id', $sct->id)
        ->orderBy('created_at', 'desc')

        ->get();

        $assignments = Assignment::with('lesson')
        ->whereHas('lesson', function ($query) use ($classroom_id) {
           $query->whereHas('subjectClassroomTeacher', function($q) use ($classroom_id) {
                $q->where('classroom_id', $classroom_id);
           }) ;
        })
        ->get();

        return Inertia::render('Student/ClassroomPage', compact('sct', 'class_students_count','academic_periode', 'lessons', 'assignments'));
    }

    public function lesson(Request $request, $lesson_id) {

        $lesson = Lesson::with('subjectClassroomTeacher')
        ->where('id', $lesson_id)
        ->firstOrFail();
        $assignment = Assignment::where('lesson_id', $lesson->id)->first();

        $sct = SubjectClassTeacher::with('subject', 'classroom.students', 'classroom.semester', 'teacher')
        ->where('id', $lesson->subject_class_teacher_id)
        ->first();
        
        $class_students_count = $sct->classroom->students->count();
        $semester = $sct->classroom->semester;
        $academic_period = SemesterType::name($semester->semester_type, $semester->academic_year);

        return Inertia::render('Student/AssignmentDetailPage', compact('sct', 'assignment', 'lesson', 'class_students_count', 'academic_period'));
    }

    public function absence(Request $request, $sct_id) {

        $absences = Absence::where('subject_class_teacher_id', $sct_id)->get();
        
        return Inertia::render('Absence', compact('absences'));
    }
    public function absence_show(Request $request, $sct_id) {
        
        return Inertia::render('AbsenceShow');
    }
    public function absence_store(Request $request) {
        
        return redirect()->back()->with('success', 'Berhasil simpan absen');
    }
   
    public function assignments(Request $request) {
        
        return Inertia::render('Student/Assignments');
    }

    public function assignment(Request $request, $lesson_id, $assignment_id) {
        $assignment = Assignment::with('lesson')
        ->where('lesson_id', $lesson_id)
        ->where('id', $assignment_id)
        ->firstOrFail();

        $sct = SubjectClassTeacher::with('subject', 'classroom.students', 'teacher')
        ->where('id', $assignment->lesson->id)
        ->where('classroom_id', $request->user()->student->classroom_id)
        ->first();
        
        $class_students_count = $sct->classroom->students->count();

        return Inertia::render('Student/AssignmentDetailPage', compact('sct', 'assignment', 'class_students_count'));
    }
}
