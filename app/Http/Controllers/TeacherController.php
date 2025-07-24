<?php

namespace App\Http\Controllers;

use App\Constants\SemesterType;
use App\Models\Absence;
use App\Models\Assignment;
use App\Models\Lesson;
use App\Models\Semester;
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

        $semesters = Semester::all();
            
        return Inertia::render('Teacher/DashboardPage', compact('sct', 'assignments', 'semesters'));
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

        return Inertia::render('Teacher/AssignmentDetailPage', compact('sct', 'assignment', 'lesson', 'class_students_count', 'academic_period'));
    }
    public function lesson_store(Request $request) {
        try {
            $validated = $request->validate([
                'subject_class_teacher_id' => 'required|exists:subject_class_teachers,id',
                'topic' => 'required|string',
                'description' => 'required|string',
                'attachments.*' => 'nullable|file|max:10240', // 10MB max per file
            ]);

            // Create the lesson first
            $lesson = Lesson::create([
                'subject_class_teacher_id' => $validated['subject_class_teacher_id'],
                'topic' => $validated['topic'],
                'description' => $validated['description'],
            ]);

            // Handle file uploads if attachments exist
            if ($request->hasFile('attachments')) {
                $sct_id = $validated['subject_class_teacher_id'];
                $uploadPath = "sct/{$sct_id}/files";
                
                // Create directory if it doesn't exist
                $fullPath = public_path($uploadPath);
                if (!file_exists($fullPath)) {
                    mkdir($fullPath, 0755, true);
                }

                $attachmentPaths = [];
                
                foreach ($request->file('attachments') as $file) {
                    // Generate unique filename
                    $filename = time() . '_' . $file->getClientOriginalName();
                    
                    // Move file to public directory
                    $file->move($fullPath, $filename);
                    
                    // Store relative path for database
                    $attachmentPaths[] = $uploadPath . '/' . $filename;
                }

                // Update lesson with attachment paths (assuming you have an attachments column)
                $lesson->update([
                    'attachments' => json_encode($attachmentPaths)
                ]);
            }

            return redirect()->back()->with('success', 'Berhasil tambah materi');
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan saat menyimpan file.'])->withInput();
        }
    }
    public function lesson_delete(Request $request, $id) {

        $lesson = Lesson::findOrFail($id);

        $lesson->delete();

        return \redirect()->back()->with('success', 'Berhasil hapus materi');
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

        return Inertia::render('Teacher/ClassroomPage', compact('sct', 'class_students_count','academic_periode', 'lessons', 'assignments'));
    }

    public function absence(Request $request, $sct_id) {
        $sct = SubjectClassTeacher::with('classroom.students', 'subject', 'teacher')->findOrFail($sct_id);

        $class_students_count = $sct->classroom->students->count();

        $classroom_id = $sct->classroom_id;

        $absences = Absence::where('subject_class_teacher_id', $sct_id)->get();

        return Inertia::render('AbsencePage', compact('sct', 'absences', 'class_students_count'));
    }
   
    public function absence_show(Request $request, $sct_id, $date) {

        // $sct = SubjectClassTeacher::with('classroom.students', 'subject')->findOrFail($sct_id);
        $sct = SubjectClassTeacher::with([
            'subject',
            'classroom.students',
            'absences' => function($query) use ($date) {
                $query->whereDate('date', $date)
                      ->with('student');
            }
        ])
        ->findOrFail($sct_id);

        $sct->absences->transform(function ($absence) {
            $statusMap = [
                '0' => 'H',
                '1' => 'I',
                '2' => 'A',
                '3' => 'S'
            ];
            $absence->status = $statusMap[$absence->status] ?? $absence->status;
            return $absence;
        });

        return Inertia::render('AbsenceShowPage', [
            'sct' => $sct,
            'date' => $date,
            'absences' => $sct->absences,
            'students' => $sct->classroom->students
        ]);
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
        try {
            $validated = $request->validate([
                'subject_class_teacher_id' => 'required|exists:subject_class_teachers,id',
                'topic' => 'required|string',
                'description' => 'required|string',
                'due_date' => 'required|date',
                'due_time' => 'required|date_format:H:i',
                'attachments.*' => 'nullable|file|max:10240', // 10MB max per file
            ]);

            // Create the lesson first
            $lesson = Lesson::create([
                'subject_class_teacher_id' => $validated['subject_class_teacher_id'],
                'topic' => $validated['topic'],
                'description' => $validated['description'],
            ]);

            // Create the assignment
            $assignment = Assignment::create([
                'lesson_id' => $lesson->id,
                'name' => $validated['topic'],
                'description' => $validated['description'],
                'due_date' => $validated['due_date'],
                'due_time' => $validated['due_time'],
            ]);

            // Handle file uploads if attachments exist
            if ($request->hasFile('attachments')) {
                $sct_id = $validated['subject_class_teacher_id'];
                $uploadPath = "sct/{$sct_id}/files";
                
                // Create directory if it doesn't exist
                $fullPath = public_path($uploadPath);
                if (!file_exists($fullPath)) {
                    mkdir($fullPath, 0755, true);
                }

                $attachmentPaths = [];
                
                foreach ($request->file('attachments') as $file) {
                    // Generate unique filename
                    $filename = time() . '_' . $file->getClientOriginalName();
                    
                    // Move file to public directory
                    $file->move($fullPath, $filename);
                    
                    // Store relative path for database
                    $attachmentPaths[] = $uploadPath . '/' . $filename;
                }

                // Update assignment with attachment paths
                $lesson->update([
                    'attachments' => json_encode($attachmentPaths)
                ]);
            }

            return redirect()->back()->with('success', 'Tugas berhasil dibuat');
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan saat membuat tugas.'])->withInput();
        }
    }
}
