<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\Student;
use Illuminate\Http\Request;

class ClassroomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
         $request->validate([
            'name' => 'required|string|max:255',
            'homeroom_teacher_id' => 'nullable|exists:teachers,id',
            'semester_id' => 'required|exists:semesters,id',
            'major_id' => 'required|exists:majors,id'
        ]);

        Classroom::create([
            'name' => $request->name,
            'major_id' => $request->major_id,
            'semester_id' => $request->semester_id,
            'homeroom_teacher_id' => $request->homeroom_teacher_id,
        ]);

        return redirect()->back()->with('success', 'Kelas berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Classroom $classroom)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'homeroom_teacher_id' => 'nullable|exists:teachers,id',
            'semester_id' => 'required|exists:semesters,id',
            'major_id' => 'required|exists:majors,id'
        ]);

        // Update data
        $classroom->update($validated);

        return back()->with('success', 'Kelas berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Classroom::findOrFail($id)->delete();

        return redirect()->back()->with('success', 'Kelas berhasil dihapus.');
    }

    public function student_bulk_move(Request $request)
    {
        $validated = $request->validate([
            'students' => 'required|array',
            'students.*.student_id' => 'required|exists:students,id',
            'students.*.classroom_id' => 'required|exists:classrooms,id',
        ]);

        foreach ($validated['students'] as $studentData) {
            Student::where('id', $studentData['student_id'])
                ->update(['classroom_id' => $studentData['classroom_id']]);
        }

        return redirect()->back()->with('success', 'Murid berhasil dimasukkan ke kelas.');
    }
    public function student_move(Classroom $classroom, Student $student)
    {
        $student->update([
            'classroom_id' => $classroom->id,
        ]);

        return redirect()->back()->with('success', 'Murid berhasil dimasukkan ke kelas.');
    }
    
    public function student_remove(Classroom $classroom, Student $student)
    {
        $student->update([
            'classroom_id' => NULL,
        ]);

        return redirect()->back()->with('success', 'Murid berhasil dihapus.');
    }
}
