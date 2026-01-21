<?php

use Inertia\Inertia;
use Laravel\Fortify\Features;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Users\StudentController;
use App\Http\Controllers\Users\GuardianController;
use App\Http\Controllers\System\Configuration\StreamController;
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
    });

    // Students Managements.
    Route::resource('students', StudentController::class);
    Route::resource('guardian', GuardianController::class);
});

require __DIR__ . '/settings.php';
