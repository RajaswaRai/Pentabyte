<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\ClassroomController;
use App\Http\Controllers\Admin\SemesterController;
use App\Http\Controllers\Admin\StudentController;
use App\Http\Controllers\Admin\SubjectController;
use App\Http\Controllers\Admin\TeacherController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'verified'])->group(function () {

    // SHARED ROUTE
    Route::get('/sct/{id}', [DashboardController::class, 'subject'])->name('classroom');
    Route::get('/lesson/{lesson}/comments', [DashboardController::class, 'comments'])->name('lesson.comments');
    Route::post('/lesson/{lesson}/comments', [DashboardController::class, 'storeComment'])->name('lesson.comments.store');
    Route::get('/assignments', [DashboardController::class, 'assignments'])->name('assignments');
    Route::get('/lesson/{lesson_id}/assignment/{assignment_id}', [DashboardController::class, 'assignment'])->name('assignment');

    // STUDENT & GUARDIAN
    Route::get('/report-card', function () {
        return Inertia::render('Student/StudentCardReport');
    })->name('report_card');

    // TEACHER ONLY
    Route::get('/teacher-student-absence', function () {
        return Inertia::render('Student/TeacherStudentAbsence');
    })->name('absence');

    // ADMIN ONLY
    Route::prefix('admin')->middleware('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'index'])->name('admin.dashboard');

        Route::get('/subject', [AdminController::class, 'subject'])->name('admin.subject');

        Route::get('/classroom', [AdminController::class, 'classroom'])->name('admin.classroom');
        Route::get('/classroom/{classroom}', [AdminController::class, 'classroom_show'])->name('admin.classroom.show');

        Route::get('/teacher', [AdminController::class, 'teacher'])->name('admin.teacher');

        Route::get('/student', [AdminController::class, 'student'])->name('admin.student');
        
        Route::get('/schedule', [AdminController::class, 'schedule'])->name('admin.schedule');
        Route::get('/schedule/{schedule}', [AdminController::class, 'schedule_show'])->name('admin.schedule.show');

        Route::get('/semester', [AdminController::class, 'semester'])->name('admin.semester');

        // Proccess
        Route::post('/semester/add', [SemesterController::class, 'store'])->name('admin.semester.store');
        Route::put('/semester/{semester}', [SemesterController::class, 'bulkUpdate'])->name('admin.semester.update');
        Route::delete('/semester/{id}', [SemesterController::class, 'bulkDestroy'])->name('admin.semester.destroy');

        Route::post('/student/add', [StudentController::class, 'store'])->name('admin.student.store');
        Route::put('/student/{student}', [StudentController::class, 'update'])->name('admin.student.update');
        Route::delete('/student/{id}', [StudentController::class, 'destroy'])->name('admin.student.destroy');

        Route::post('/teacher/add', [TeacherController::class, 'store'])->name('admin.teacher.store');
        Route::put('/teacher/{teacher}', [TeacherController::class, 'update'])->name('admin.teacher.update');
        Route::delete('/teacher/{id}', [TeacherController::class, 'destroy'])->name('admin.teacher.destroy');

        Route::post('/subject/add', [SubjectController::class, 'store'])->name('admin.subject.store');
        Route::put('/subject/{subject}', [SubjectController::class, 'update'])->name('admin.subject.update');
        Route::delete('/subject/{id}', [SubjectController::class, 'destroy'])->name('admin.subject.destroy');

        Route::post('/classroom/add', [ClassroomController::class, 'store'])->name('admin.classroom.store');
        Route::put('/classroom/{classroom}', [ClassroomController::class, 'update'])->name('admin.classroom.update');
        Route::delete('/classroom/{classroom}/student/{student}', [ClassroomController::class, 'student_remove'])->name('admin.classroom.student.remove');
        Route::delete('/classroom/{id}', [ClassroomController::class, 'destroy'])->name('admin.classroom.destroy');
    });
});

require __DIR__ . '/auth.php';
