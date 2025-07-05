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
        ]);

        Classroom::create([
            'name' => $request->name,
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
            'name' => ['required', 'string', 'max:255'],
            'homeroom_teacher_id' => ['nullable', 'exists:teachers,id'],
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

    public function student_remove(Student $student)
    {
        $student->update([
            'classroom_id' => NULL,
        ]);

        return redirect()->back()->with('success', 'Murid berhasil dihapus.');
    }
}
