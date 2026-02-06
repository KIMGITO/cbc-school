<?php

use Inertia\Inertia;
use Laravel\Fortify\Features;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Users\StudentController;
use App\Http\Controllers\Users\GuardianController;
use App\Http\Controllers\Academic\StreamController;
use App\Http\Controllers\Academic\GradeLevelController;
use App\Http\Controllers\Core\DepartmentController;
use App\Http\Controllers\Core\CourseController;
use App\Http\Controllers\Core\AcademicYearController;
use App\Http\Controllers\Core\TermController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'web', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // System Settings


    Route::prefix('system/config')->group(function () {
        Route::patch('/levels/{level}/status', [GradeLevelController::class, 'toggleActive']);
        Route::resource('levels', GradeLevelController::class)->names('system.config.levels');

        Route::patch('/streams/{stream}/status', [StreamController::class, 'toggleActive']);
        Route::resource('streams', StreamController::class)->names('system.config.streams');

        Route::patch('/departments/{department}/status', [DepartmentController::class, 'toggleActive']);
        Route::resource('departments', DepartmentController::class)->names('system.config.departments');

        Route::patch('/courses/{course}/status', [CourseController::class, 'toggleActive']);
        Route::resource('courses', CourseController::class)->names('system.config.departments');

        // school academic year e.g 2026/27
        Route::patch('/years/{year}/status', [AcademicYearController::class, 'toggleActive']);
        Route::resource('years', AcademicYearController::class)->names('system.config.years');

        Route::patch('/terms/{term}/status', [TermController::class, 'toggleActive']);
        Route::resource('terms', TermController::class)->names('system.config.terms');
    });

    // Students Managements.
    Route::resource('students', StudentController::class);
    Route::resource('guardians', GuardianController::class);
    // Route::class('teachers', )
});

require __DIR__ . '/settings.php';
