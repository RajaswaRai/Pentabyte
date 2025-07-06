<?php

namespace App\Http\Controllers\Admin;

use App\Constants\SemesterType;
use App\Http\Controllers\Controller;
use App\Models\Semester;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SemesterController extends Controller
{

    public function store(Request $request)
    {
        $request->validate([
            'academic_year' => 'required|string',
            
            'odd_start_date' => 'required|date',
            'odd_end_date' => 'required|date',
            
            'even_start_date' => 'required|date',
            'even_end_date' => 'required|date',
        ]);

        DB::beginTransaction();

        try {
            
            $odd_name = SemesterType::name(SemesterType::ODD, $request->academic_year);
            Semester::create([
                'name' => $odd_name,
                'semester_type' => SemesterType::ODD,
                'academic_year' => $request->academic_year,
                'start_date' => $request->odd_start_date,
                'end_date' => $request->odd_end_date,
            ]);
            
            $even_name = SemesterType::name(SemesterType::EVEN, $request->academic_year);
            Semester::create([
                'name' => $even_name,
                'semester_type' => SemesterType::EVEN,
                'academic_year' => $request->academic_year,
                'start_date' => $request->even_start_date,
                'end_date' => $request->even_end_date,
            ]);

            DB::commit();

            return redirect()->back();
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors([
                'store' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ]);
        }
    }


    public function update(Request $request, Semester $semester)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date',
        ]);

        DB::beginTransaction();

        try {

            $semester->update([
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
            ]);

            DB::commit();

            return back()->with('success', 'Semester berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal memperbarui semester: ' . $e->getMessage());
        }
    }
    public function bulkUpdate(Request $request, $academicYear)
    {
        $request->validate([
            'odd_start_date' => 'nullable|date',
            'odd_end_date' => 'nullable|date',
            'even_start_date' => 'nullable|date',
            'even_end_date' => 'nullable|date',
        ]);

        DB::beginTransaction();

        try {
            // Semester Ganjil (semester_type = 1)
            $oddSemester = Semester::where('academic_year', $academicYear)
                ->where('semester_type', 1)
                ->first();

            if ($oddSemester && ($request->odd_start_date || $request->odd_end_date)) {
                $oddSemester->update([
                    'start_date' => $request->odd_start_date ?? $oddSemester->start_date,
                    'end_date' => $request->odd_end_date ?? $oddSemester->end_date,
                ]);
            }

            // Semester Genap (semester_type = 2)
            $evenSemester = Semester::where('academic_year', $academicYear)
                ->where('semester_type', 2)
                ->first();

            if ($evenSemester && ($request->even_start_date || $request->even_end_date)) {
                $evenSemester->update([
                    'start_date' => $request->even_start_date ?? $evenSemester->start_date,
                    'end_date' => $request->even_end_date ?? $evenSemester->end_date,
                ]);
            }

            DB::commit();

            return back()->with('success', 'Semester ganjil dan genap berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal memperbarui semester: ' . $e->getMessage());
        }
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $semester = Semester::findOrFail($id);
        $semester->delete();

        return redirect()->back()->with('success', 'Semester berhasil dihapus.');
    }
    public function bulkDestroy(string $academicYear)
    {
        try {
            // Hapus semua semester yang memiliki academic_year tersebut
            Semester::where('academic_year', $academicYear)->delete();

            return redirect()->back()->with('success', 'Semua semester pada tahun akademik ' . $academicYear . ' berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal menghapus semester: ' . $e->getMessage());
        }
    }

}
