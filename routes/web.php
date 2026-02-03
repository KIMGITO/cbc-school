<?php

use App\Http\Controllers\System\Configuration\CourseController;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Users\StudentController;
use App\Http\Controllers\Users\GuardianController;
use App\Http\Controllers\System\Configuration\StreamController;
use App\Http\Controllers\System\Configuration\DepartmentController;
use App\Http\Controllers\System\Configuration\GradeLevelController;

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
    });

    // Students Managements.
    Route::resource('students', StudentController::class);
    Route::resource('guardians', GuardianController::class);
});

require __DIR__ . '/settings.php';
