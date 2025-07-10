<?php

namespace App\Http\Controllers;

use App\Models\Absence;
use App\Models\SubjectClassTeacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class AbsenceController extends Controller
{

    public function save(Request $request, $id)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'students' => 'required|array',
            'students.*.student_id' => 'required|integer',
            'students.*.status' => 'required|string|in:H,I,A,S', // H: Hadir, I: Izin, A: Alpha, S: Sakit
        ]);

        foreach ($validated['students'] as $student) {
            Absence::updateOrCreate(
                [
                    'student_id' => $student['student_id'],
                    'subject_class_teacher_id' => $id,
                    'date' => $validated['date'],
                ],
                [
                    'status' => $student['status'],
                ]
            );
        }

        return Redirect::back()->with('success', 'Absensi berhasil disimpan.');
    }

    /**
     * Update data absensi spesifik (misalnya via edit form).
     */
    public function update(Request $request, $absenceId)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:H,I,A,S',
        ]);

        $absence = Absence::findOrFail($absenceId);
        $absence->status = $validated['status'];
        $absence->save();

        return Redirect::back()->with('success', 'Absensi berhasil diperbarui.');
    }

    /**
     * Hapus absensi berdasarkan ID.
     */
    public function delete($absenceId)
    {
        $absence = Absence::findOrFail($absenceId);
        $absence->delete();

        return Redirect::back()->with('success', 'Absensi berhasil dihapus.');
    }
}
