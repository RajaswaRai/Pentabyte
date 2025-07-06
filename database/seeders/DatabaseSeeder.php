<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use App\Constants\UserRole;
use App\Models\Assignment;
use App\Models\Classroom;
use App\Models\Lesson;
use App\Models\LessonComment;
use App\Models\Major;
use App\Models\Semester;
use App\Models\Student;
use App\Models\Subject;
use App\Models\SubjectClassTeacher;
use App\Models\Teacher;
use App\Models\User;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin & Roles
        $admin = User::factory()->create([
            'username' => 'admin',
            'email' => 'admin@pentabyte.com',
            'role' => 0,
        ]);
        \App\Models\Admin::create([
            'user_id' => $admin->id,
            'full_name' => 'Im Admin',
        ]);

        // Guru dan Akun
        $user = User::factory()->create([
            'username' => 'dr_legowo',
            'role' => UserRole::TEACHER,
        ]);
        $teacher = Teacher::create([
            'user_id' => $user->id,
            'nip' => fake()->randomNumber(9),
            'full_name' => 'Dr. Legowo'
        ]);

        // Jurusan
        $major = Major::create([
            'name' => 'Software Engineer',
            'code' => 'SE',
        ]);

        // Semester
        $ganjil = Semester::create([
            "name" => "Ganjil 2025/2026",
            "academic_year" => "2025",
            "semester_type" => "1",
            "start_date" => Carbon::parse('2025-07-06'),
            "end_date" => Carbon::parse('2026-01-02'),
        ]);
        $genap = Semester::create([
            "name" => "Genap 2025/2026",
            "academic_year" => "2025",
            "semester_type" => "2",
            "start_date" => Carbon::parse('2026-01-03'),
            "end_date" => Carbon::parse('2026-07-06'),
        ]);

        // Subjects
        $subjectNames = ['Math', 'English', 'Science', 'Physics', 'Chemistry', 'History'];
        $subjects = collect($subjectNames)->map(fn($name) => Subject::create(['name' => $name]));

        // Classrooms
        $classrooms = collect(['A', 'B', 'C'])->map(function ($name) use ($teacher, $ganjil, $major) {
            return Classroom::create([
                'homeroom_teacher_id' => $teacher->id,
                'name' => $name,
                'semester_id' => $ganjil->id,
                'major_id' => $major->id,
            ]);
        });

        // Jadwal acak
        $timeSlots = [
            ['07:30:00', '08:30:00'],
            ['08:30:00', '10:00:00'],
            ['10:00:00', '11:30:00'],
            ['12:00:00', '13:30:00'],
            ['13:30:00', '14:30:00'],
            ['14:30:00', '15:30:00'],
        ];
        $days = range(0, 6);

        $lessonTopics = ['Pengenalan', 'Persamaan Linier', 'Hukum Newton', 'Reaksi Kimia', 'Analisis Data'];
        $lessonDescs = [
            'Topik awal untuk pemahaman dasar.',
            'Pembahasan tentang bentuk umum dan solusi.',
            'Konsep gaya dan gerak.',
            'Interaksi antar zat kimia.',
            'Pengolahan dan interpretasi data.',
        ];
        $assignmentNames = ['Tugas 1', 'Tugas 2', 'Latihan', 'Quiz', 'Ujian Tengah Semester'];
        $assignmentDescs = [
            'Kerjakan soal latihan pada buku halaman 23.',
            'Uraikan pengertian dan berikan contoh.',
            'Selesaikan eksperimen dan laporkan hasilnya.',
            'Jawab soal pilihan ganda dan esai.',
            'Analisis grafik dan tabel.',
        ];

        foreach ($classrooms as $i => $classroom) {
            $subject = $subjects[$i % count($subjects)];
            $slot = $timeSlots[$i % count($timeSlots)];
            $day = (string) $days[$i % count($days)];

            $sct = SubjectClassTeacher::create([
                'day' => $day,
                'start_time' => $slot[0],
                'end_time' => $slot[1],
                'subject_id' => $subject->id,
                'teacher_id' => $teacher->id,
                'classroom_id' => $classroom->id,
            ]);

            $lesson = Lesson::create([
                'subject_class_teacher_id' => $sct->id,
                'topic' => $lessonTopics[$i],
                'description' => $lessonDescs[$i],
            ]);

            Assignment::create([
                'name' => $assignmentNames[$i],
                'description' => $assignmentDescs[$i],
                'due_date' => Carbon::now()->addDays($i + 1)->format('Y-m-d'),
                'due_time' => $slot[1],
                'lesson_id' => $lesson->id,
            ]);

            LessonComment::create([
                'content' => 'Komentar otomatis dari seeder.',
                'lesson_id' => $lesson->id,
                'user_id' => $user->id,
            ]);
        }

        // Siswa
        $student = User::factory()->create([
            'username' => 'student_1',
            'role' => UserRole::STUDENT,
            'password' => Hash::make('12345678'),
        ]);
        Student::create([
            'full_name' => 'Student 1',
            'nisn' => '123456789',
            'date_of_birth' => now()->format('Y-m-d'),
            'gender' => 'male',
            'phone' => '0888777666',
            'user_id' => $student->id,
            'major_id' => $major->id,
            'classroom_id' => $classrooms->first()->id,
        ]);

        // Tambahan: Subject baru
        $additionalSubjects = collect(['Biology', 'Geography', 'Sociology'])->map(fn($name) => Subject::create(['name' => $name]));

        // Tambahan: Classroom baru
        $additionalClassrooms = collect(['D', 'E', 'F'])->map(function ($name) use ($teacher, $genap, $major) {
            return Classroom::create([
                'homeroom_teacher_id' => $teacher->id,
                'name' => $name,
                'semester_id' => $genap->id,
                'major_id' => $major->id,
            ]);
        });

        // Tambahan: Jadwal acak
        $extraSlots = [
            ['day' => '2', 'start_time' => '12:00:00', 'end_time' => '13:30:00'],
            ['day' => '6', 'start_time' => '08:30:00', 'end_time' => '10:00:00'],
            ['day' => '4', 'start_time' => '10:00:00', 'end_time' => '11:30:00'],
            ['day' => '5', 'start_time' => '10:00:00', 'end_time' => '11:30:00'],
            ['day' => '2', 'start_time' => '07:30:00', 'end_time' => '08:30:00'],
            ['day' => '0', 'start_time' => '14:30:00', 'end_time' => '15:30:00'],
            ['day' => '6', 'start_time' => '13:30:00', 'end_time' => '14:30:00'],
        ];

        // Tambahan: Lesson dan Assignment
        $extraLessonAssignment = [
            [
                'lesson' => [
                    'topic' => 'Fotosintesis',
                    'description' => 'Mekanisme fotosintesis pada tumbuhan.',
                ],
                'assignment' => [
                    'name' => 'Tugas Biologi',
                    'description' => 'Jelaskan proses fotosintesis.',
                    'due_date' => Carbon::parse('2025-07-13')->format('Y-m-d'),
                    'due_time' => '08:30:00',
                ]
            ],
            [
                'lesson' => [
                    'topic' => 'Peta Dunia',
                    'description' => 'Pembelajaran tentang letak geografis negara.',
                ],
                'assignment' => [
                    'name' => 'Tugas Geo',
                    'description' => 'Buat peta dan tandai negara ASEAN.',
                    'due_date' => Carbon::parse('2025-07-14')->format('Y-m-d'),
                    'due_time' => '10:00:00',
                ]
            ],
            [
                'lesson' => [
                    'topic' => 'Perilaku Sosial',
                    'description' => 'Analisis perilaku sosial masyarakat.',
                ],
                'assignment' => [
                    'name' => 'Tugas Sosiologi',
                    'description' => 'Identifikasi perilaku menyimpang.',
                    'due_date' => Carbon::parse('2025-07-15')->format('Y-m-d'),
                    'due_time' => '11:30:00',
                ]
            ],
        ];

        // Pasangkan semua dan simpan ke DB
        foreach ($additionalClassrooms as $i => $classroom) {
            $subject = $additionalSubjects[$i % $additionalSubjects->count()];
            $slot = $extraSlots[$i];
            $lessonData = $extraLessonAssignment[$i]['lesson'];
            $assignmentData = $extraLessonAssignment[$i]['assignment'];

            $sct = SubjectClassTeacher::create([
                'day' => $slot['day'],
                'start_time' => $slot['start_time'],
                'end_time' => $slot['end_time'],
                'subject_id' => $subject->id,
                'teacher_id' => $teacher->id,
                'classroom_id' => $classroom->id,
            ]);

            $lesson = Lesson::create([
                'subject_class_teacher_id' => $sct->id,
                'topic' => $lessonData['topic'],
                'description' => $lessonData['description'],
            ]);

            Assignment::create([
                'lesson_id' => $lesson->id,
                'name' => $assignmentData['name'],
                'description' => $assignmentData['description'],
                'due_date' => $assignmentData['due_date'],
                'due_time' => $assignmentData['due_time'],
            ]);
        }

        // Guru tambahan (akun & data)
        $extraTeachers = [
            ['username' => 'teacher_1', 'nip' => '784655302', 'full_name' => 'Teacher 1'],
            ['username' => 'teacher_2', 'nip' => '118691005', 'full_name' => 'Teacher 2'],
            ['username' => 'teacher_3', 'nip' => '352028760', 'full_name' => 'Teacher 3'],
        ];
        foreach ($extraTeachers as $et) {
            $tUser = User::factory()->create([
                'username' => $et['username'],
                'role' => UserRole::TEACHER,
            ]);
            Teacher::create([
                'user_id' => $tUser->id,
                'nip' => $et['nip'],
                'full_name' => $et['full_name'],
            ]);
        }

        $teacherMap = Teacher::pluck('id', 'full_name');
        $subjectMap = Subject::pluck('id', 'name');
        $classroomMap = Classroom::pluck('id', 'name');

        $sctVariations = [
            ['Math', 'A', 'Dr. Legowo', '1', '07:30:00', '08:30:00'],
            ['English', 'B', 'Teacher 1', '2', '08:30:00', '10:00:00'],
            ['Science', 'C', 'Teacher 2', '3', '10:00:00', '11:30:00'],
            ['Physics', 'A', 'Teacher 3', '4', '12:00:00', '13:30:00'],
            ['Chemistry', 'B', 'Dr. Legowo', '5', '13:30:00', '14:30:00'],
            ['History', 'C', 'Teacher 1', '6', '14:30:00', '15:30:00'],
            ['Biology', 'D', 'Teacher 2', '1', '10:00:00', '11:30:00'],
            ['Geography', 'E', 'Teacher 3', '2', '07:30:00', '08:30:00'],
            ['Sociology', 'F', 'Dr. Legowo', '3', '08:30:00', '10:00:00'],
            ['Math', 'D', 'Teacher 1', '4', '10:00:00', '11:30:00'],
            ['English', 'E', 'Teacher 2', '5', '12:00:00', '13:30:00'],
            ['Science', 'F', 'Teacher 3', '6', '13:30:00', '14:30:00'],
        ];

        foreach ($sctVariations as [$subject, $classroom, $teacher, $day, $start, $end]) {
            SubjectClassTeacher::create([
                'subject_id' => $subjectMap[$subject],
                'classroom_id' => $classroomMap[$classroom],
                'teacher_id' => $teacherMap[$teacher],
                'day' => $day,
                'start_time' => $start,
                'end_time' => $end,
            ]);
        }


        Log::info('Seeder completed with dynamic data on ' . now());
    }
}
