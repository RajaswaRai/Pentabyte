<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SubjectClassTeacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ScheduleController extends Controller
{
    /**
     * Store a newly created schedule.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'classroom_id' => 'required|exists:classrooms,id',
            'teacher_id' => 'required|exists:teachers,id',
            'day' => 'required|in:0,1,2,3,4,5,6',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);

        try {
            SubjectClassTeacher::create($validated);
            return redirect()->back()->with('success', 'Jadwal berhasil ditambahkan.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors([
                'store' => 'Terjadi kesalahan saat menyimpan: ' . $e->getMessage(),
            ]);
        }
    }

    /**
     * Update the specified schedule.
     */
    public function update(Request $request, SubjectClassTeacher $subjectClassTeacher)
    {
        $validated = $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'teacher_id' => 'required|exists:teachers,id',
            'day' => 'required|in:0,1,2,3,4,5,6',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);

        try {
            $subjectClassTeacher->update($validated);
            return redirect()->back()->with('success', 'Jadwal berhasil diperbarui.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors([
                'update' => 'Gagal memperbarui jadwal: ' . $e->getMessage(),
            ]);
        }
    }

    /**
     * Remove the specified schedule.
     */
    public function destroy(SubjectClassTeacher $subjectClassTeacher)
    {
        try {
            $subjectClassTeacher->delete();
            return redirect()->back()->with('success', 'Jadwal berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors([
                'delete' => 'Gagal menghapus jadwal: ' . $e->getMessage(),
            ]);
        }
    }
}
