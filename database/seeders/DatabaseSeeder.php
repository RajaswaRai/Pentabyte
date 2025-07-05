<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\Log;
use App\Constants\UserRole;
use App\Models\Assignment;
use App\Models\Classroom;
use App\Models\Lesson;
use App\Models\LessonComment;
use App\Models\Student;
use App\Models\Subject;
use App\Models\SubjectClassTeacher;
use App\Models\Teacher;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        $admin = \App\Models\User::factory()->create([
            'username' => 'admin',
            'email' => 'admin@pentabyte.com',
            'role' => 0, //admin
        ]);
        \App\Models\Admin::create([
            'user_id' => $admin->id,
            'full_name' => 'Im Admin',
        ]);

        Subject::create([
            'name' => 'Math',
        ]);
        Subject::create([
            'name' => 'English',
        ]);
        $subject = Subject::create([
            'name' => 'Science',
        ]);
        $user = User::factory()->create([
            'username' => 'dr_legowo',
            'role' => UserRole::TEACHER,
        ]);
        $teacher = Teacher::create([
            'user_id' => $user->id,
            'nip' => fake()->randomNumber(9),
            'full_name' => 'Dr. Legowo'
        ]);
        $class = Classroom::create([
            'homeroom_teacher_id' => $teacher->id,
            'name' => 'A'
        ]);
        $sct = SubjectClassTeacher::create([
            'day' => (string) Carbon::now()->dayOfWeek,
            'start_time' => Carbon::now()->format('H:i:s'),
            'end_time' => Carbon::now()->format('H:i:s'),
            'subject_id' => $subject->id,
            'teacher_id' => $teacher->id,
            'classroom_id' => $class->id,
        ]);
        $lesson = Lesson::create([
            'subject_class_teacher_id' => $sct->id,
            'topic' => 'Lorem, ipsum dolor.',
            'description' => 'Lorem ipsum dolor sit amet consectetur adipisicing.',
        ]);
        LessonComment::create([
            'content' => 'This is a comment',
            'lesson_id' => $lesson->id,
            'user_id' => $user->id,
        ]);
        Assignment::create([
            'name' => 'Kalkulus 3',
            'description' => 'berhitung mtk',
            'due_date' => date('Y-m-d'),
            'due_time' => Carbon::now()->format('H:i:s'),
            'lesson_id' => $lesson->id,
        ]);
        $student = User::factory()->create([
            'username' => 'student_1',
            'role' => UserRole::STUDENT,
            'password' => Hash::make('12345678'),
        ]);
        Student::create([
            'full_name' => 'Student 1',
            'nisn' => '123456789',
            'date_of_birth' => date('Y-m-d'),
            'gender' => 'male',
            'phone' => '0888777666',
            'user_id' => $student->id,
            'classroom_id' => $class->id,
        ]);
        
        Log::info('Seeder running at: ' . now());
        Log::info('Seeder day index: ' . Carbon::now()->dayOfWeek);
    }
}
