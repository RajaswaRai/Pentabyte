<?php

namespace App\Http\Controllers\Admin;

use App\Constants\UserRole;
use App\Http\Controllers\Controller;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class TeacherController extends Controller
{
     /**
     * Store a newly created teacher and user.
     */
    public function store(Request $request)
    {
        $request->validate([
            'username' => 'required|string|max:255|unique:users,username',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',

            'full_name' => 'required|string|max:255',
            'nip' => 'required|numeric|unique:teachers,nip',
        ]);

        DB::beginTransaction();

        try {
            $user = User::create([
                'username' => $request->username,
                'email' => $request->email,
                'password' => bcrypt($request->password),
                'role' => UserRole::TEACHER,
            ]);

            Teacher::create([
                'full_name' => $request->full_name,
                'nip' => $request->nip,
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



    /**
     * Update teacher and user data.
     */
    public function update(Request $request, Teacher $teacher)
    {
        $user = User::findOrFail($teacher->user_id);

        $request->validate([
            'username' => ['required', 'string', 'max:255', Rule::unique('users', 'username')->ignore($user->id)],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:8'],

            'full_name' => ['required', 'string', 'max:255'],
            'nip' => ['required', 'numeric', Rule::unique('teachers', 'nip')->ignore($teacher->id)],
        ]);

        DB::beginTransaction();

        try {
            $user->username = $request->username;
            $user->email = $request->email;
            if ($request->filled('password')) {
                $user->password = bcrypt($request->password);
            }
            $user->save();

            $teacher->update([
                'full_name' => $request->full_name,
                'nip' => $request->nip,
            ]);

            DB::commit();

            return back()->with('success', 'Guru berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal memperbarui guru: ' . $e->getMessage());
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $teacher = Teacher::findOrFail($id);
        $teacher->user()->delete(); // delete user account also
        $teacher->delete();

        return redirect()->back()->with('success', 'Guru berhasil dihapus.');
    }
}
