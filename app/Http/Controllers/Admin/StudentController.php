<?php

namespace App\Http\Controllers\Admin;

use App\Constants\UserRole;
use App\Http\Controllers\Controller;
use App\Models\Major;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class StudentController extends Controller
{

    public function import(Request $request)
    {
        $students = $request->input('students');

        if (!is_array($students)) {
            return redirect()->back()->withErrors(['import' => 'Data tidak valid.']);
        }

        $errors = [];

        // Normalisasi dan validasi awal
        foreach ($students as $index => &$student) {
            // Normalisasi tanggal dari Excel serial number atau string
            if (isset($student['date_of_birth'])) {
                if (is_numeric($student['date_of_birth'])) {
                    try {
                        $student['date_of_birth'] = Date::excelToDateTimeObject($student['date_of_birth'])->format('Y-m-d');
                    } catch (\Exception $e) {
                        $errors["students.$index.date_of_birth"] = ['Format tanggal tidak valid (serial number gagal dikonversi).'];
                    }
                } elseif (!strtotime($student['date_of_birth'])) {
                    $errors["students.$index.date_of_birth"] = ['Format tanggal tidak dikenali.'];
                }
            }
        }
        unset($student); // hapus reference

        // Jika ada error parsing awal, langsung kembalikan
        if (!empty($errors)) {
            return redirect()->back()->withErrors($errors);
        }

        DB::beginTransaction();

        try {
            foreach ($students as $index => $student) {
                $validator = Validator::make($student, [
                    'full_name' => 'required|string|max:255',
                    'nisn' => 'required|numeric|unique:students,nisn',
                    'date_of_birth' => 'required|date',
                    'gender' => 'required|string',
                    'email' => 'nullable|email|unique:users,email',
                    'phone' => 'nullable|regex:/^[0-9]{8,20}$/',
                    'major_code' => 'required|exists:majors,code',
                ]);

                if ($validator->fails()) {
                    $errors["students.$index"] = $validator->errors()->toArray();
                    continue;
                }

                $user = User::create([
                    'username' => $student['nisn'],
                    'email' => $student['email'] ?? null,
                    'password' => bcrypt(str_replace('-', '', $student['date_of_birth'])),
                    'role' => UserRole::STUDENT,
                ]);

                $major = Major::where('code', $student['major_code'])->first();

                Student::create([
                    'full_name' => $student['full_name'],
                    'nisn' => $student['nisn'],
                    'date_of_birth' => $student['date_of_birth'],
                    'gender' => $student['gender'],
                    'phone' => $student['phone'] ?? null,
                    'major_id' => $major->id,
                    'user_id' => $user->id,
                ]);
            }

            if (!empty($errors)) {
                DB::rollBack();
                return redirect()->back()->withErrors($errors);
            }

            DB::commit();
            return redirect()->back()->with('success', 'Semua data siswa berhasil diimpor.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors([
                'Gagal mengimpor: ' . $e->getMessage(),
            ]);
        }
    }


    public function store(Request $request)
    {
        $request->validate([
            'username' => 'required|string|max:255|unique:users,username',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',

            'full_name' => 'required|string|max:255',
            'nisn' => 'required|numeric|unique:students,nisn',
            'date_of_birth' => 'required|string',
            'gender' => 'required|string',
            'major_id' => 'required|exists:majors,id',
        ]);

        DB::beginTransaction();

        try {
            $user = User::create([
                'username' => $request->username,
                'email' => $request->email,
                'password' => bcrypt($request->password),
                'role' => UserRole::STUDENT,
            ]);

            Student::create([
                'full_name' => $request->full_name,
                'nisn' => $request->nisn,
                'date_of_birth' => $request->date_of_birth,
                'gender' => $request->gender,
                'phone' => $request->phone,
                'major_id' => $request->major_id,
                'user_id' => $user->id,
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


    public function update(Request $request, Student $student)
    {
        $user = User::findOrFail($student->user_id);

        $request->validate([
            'username' => ['required', 'string', 'max:255', Rule::unique('users', 'username')->ignore($user->id)],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:8'],

            'full_name' => ['required', 'string', 'max:255'],
            'nisn' => ['required', 'numeric', Rule::unique('students', 'nisn')->ignore($student->id)],
            'date_of_birth' => ['required', 'string'],
            'gender' => ['required', 'string'],
            'phone' => ['required', 'numeric'],
            'major_id' => ['required', 'numeric', Rule::exists('majors', 'id')],
        ]);

        DB::beginTransaction();

        try {
            $user->username = $request->username;
            $user->email = $request->email;
            if ($request->filled('password')) {
                $user->password = bcrypt($request->password);
            }
            $user->save();

            $student->update([
                'full_name' => $request->full_name,
                'nisn' => $request->nisn,
                'date_of_birth' => $request->date_of_birth,
                'phone' => $request->phone,
                'gender' => $request->gender,
                'major_id' => $request->major_id,
            ]);

            DB::commit();

            return back()->with('success', 'Murid berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal memperbarui murid: ' . $e->getMessage());
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $student = Student::findOrFail($id);
        $student->user()->delete(); // delete user account also
        $student->delete();

        return redirect()->back()->with('success', 'Murid berhasil dihapus.');
    }
}
