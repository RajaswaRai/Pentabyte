<?php

namespace App\Http\Controllers;

use App\Models\Absence;
use App\Models\Assignment;
use App\Models\Lesson;
use App\Models\Student;
use App\Models\SubjectClassTeacher;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeacherController extends Controller
{
     public function index(Request $request) {
        $sct = SubjectClassTeacher::with('subject', 'classroom', 'teacher')
            ->where('teacher_id', $request->user()->teacher->id)
            ->get();

        // (0 = Sunday, 1 = Monday)
        $dayIndex = Carbon::now()->dayOfWeek;
        $assignments = Assignment::with('lesson')
        ->whereHas('lesson', function ($query) use ($sct, $request) {
            $query->whereIn('subject_class_teacher_id', $sct->pluck('id')->unique());
            $query->whereHas('subjectClassroomTeacher', function ($q) use ($request) {
                $q->where('teacher_id', $request->user()->teacher->id);
            });
        })
        ->get();
            
        return Inertia::render('Teacher/DashboardPage', compact('sct', 'assignments'));
    }

    public function lesson_store(Request $request) {
        $request->validate([
            'subject_classroom_teacher_id' => 'required|exists:subject_class_teachers,id',
            'topic' => 'required|string',
            'description' => 'required|string',
        ]);

        Lesson::create([
            'subject_class_teacher_id' => $request->subject_classroom_teacher_id,
            'topic' => $request->topic,
            'description' => $request->description,
        ]);

        return \redirect()->back()->with('success', 'Berhasil tambah materi');
    }
    public function lesson_delete(Request $request, $id) {

        $lesson = Lesson::findOrFail($id);

        $lesson->delete();

        return \redirect()->back()->with('success', 'Berhasil hapus materi');
    }

    public function subject(Request $request, $id) {
        $sct = SubjectClassTeacher::with('subject', 'classroom.students', 'teacher')
        ->where('id', $id)
        ->firstOrFail();

        $class_students_count = $sct->classroom->students->count();

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

        return Inertia::render('Teacher/ClassroomPage', compact('sct', 'class_students_count', 'lessons', 'assignments'));
    }

    public function absence(Request $request, $sct_id) {

        $sct = SubjectClassTeacher::with('classroom.students', 'subject')->findOrFail($sct_id);
        $absences = Absence::where('subject_class_teacher_id', $sct_id)->get();

        return Inertia::render('AbsencePage', compact('sct', 'absences'));
    }
    public function absence_create(Request $request, $sct_id) {

        $sct = SubjectClassTeacher::with('classroom.students', 'subject')->findOrFail($sct_id);
        
        return Inertia::render('AbsenceShowPage', compact('sct'));
    }
    public function absence_show(Request $request, $sct_id, $id) {

        // $sct = SubjectClassTeacher::with('classroom.students', 'subject')->findOrFail($sct_id);
        $absence = Absence::findOrFail($id);
        
        return Inertia::render('AbsenceShow', compact('absence'));
    }

    public function assignment(Request $request, $lesson_id, $assignment_id) {

        $assignment = Assignment::with('lesson')
        ->where('lesson_id', $lesson_id)
        ->where('id', $assignment_id)
        ->firstOrFail();

        $sct = SubjectClassTeacher::with('subject', 'classroom.students', 'teacher')
        ->where('id', $assignment->lesson->id)
        ->where('classroom_id', $request->user()->teacher->classroom->id)
        ->first();
        
        $class_students_count = $sct->classroom->students->count();

        return Inertia::render('Teacher/AssignmentDetailPage', compact('sct', 'assignment', 'class_students_count'));
    }
    public function assignment_store(Request $request) {

        $lesson = Lesson::create([
            'subject_class_teacher_id' => $request->subject_classroom_teacher_id,
            'topic' => $request->topic,
            'description' => $request->description,
        ]);
        
        $assignment = Assignment::create([
            'lesson_id' => $lesson->id,
            'name' => $request->topic,
            'description' => $request->description,
            'due_date' => $request->due_date,
            'due_time' => $request->due_time,
        ]);

        return \redirect()->back()->with('success', 'Tugas berhasil dibuat');
    }
}
