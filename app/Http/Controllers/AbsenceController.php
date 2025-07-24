<?php

namespace App\Http\Controllers;

use App\Constants\AbsensiConst;
use App\Models\Absence;
use App\Models\SubjectClassTeacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class AbsenceController extends Controller
{

    public function save(Request $request, $sct_id)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'students' => 'required|array',
            'students.*.student_id' => 'required|integer|exists:students,id',
            'students.*.status' => 'required|string|in:H,I,A,S',
        ]);

        try {
            foreach ($validated['students'] as $student) {
                // Konversi status string ke angka sesuai ENUM
                $statusNumber = match($student['status']) {
                    'H' => 0,
                    'I' => 1,
                    'A' => 2,
                    'S' => 3,
                    default => 2 // default alpha jika tidak valid
                };

                Absence::updateOrCreate(
                    [
                        'student_id' => $student['student_id'],
                        'subject_class_teacher_id' => $sct_id,
                        'date' => $validated['date'],
                    ],
                    [
                        'status' => (string)$statusNumber, // Simpan sebagai angka
                    ]
                );
            }

            return redirect()->back()->with('success', 'Absensi berhasil disimpan.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors([
                'server' => 'Terjadi kesalahan saat menyimpan data: ' . $e->getMessage()
            ])->withInput();
        }
    }
    /**
     * Update data absensi spesifik (misalnya via edit form).
     */
    // public function update(Request $request, $sct_id)
    // {
    //     $validated = $request->validate([
    //         'date' => 'required|date',
    //         'students' => 'required|array',
    //         'students.*.student_id' => 'required|integer|exists:students,id',
    //         'students.*.status' => 'required|string|in:H,I,A,S',
    //     ]);

    //     try {
    //         DB::beginTransaction();

    //         foreach ($validated['students'] as $student) {
    //             // Konversi status string ke angka sesuai ENUM
    //             $statusNumber = match($student['status']) {
    //                 'H' => 0,
    //                 'I' => 1,
    //                 'A' => 2,
    //                 'S' => 3,
    //                 default => 2 // default alpha jika tidak valid
    //             };

    //             // Update atau create record absensi
    //             Absence::updateOrCreate(
    //                 [
    //                     'subject_class_teacher_id' => $sct_id,
    //                     'student_id' => $student['student_id'],
    //                     'date' => $validated['date']
    //                 ],
    //                 [
    //                     'status' => (string)$statusNumber,
    //                 ]
    //             );
    //         }

    //         DB::commit();

    //         return redirect()->back()->with('success', 'Absensi berhasil diperbarui.');
    //     } catch (\Exception $e) {
    //         DB::rollBack();
    //         return redirect()->back()->withErrors([
    //             'server' => 'Terjadi kesalahan saat menyimpan data: ' . $e->getMessage()
    //         ])->withInput();
    //     }
    // }

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
