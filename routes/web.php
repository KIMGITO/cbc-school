<?php

use App\Http\Controllers\System\Configuration\GradeLevelController;
use App\Http\Controllers\Users\StudentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'web','verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // System Settings


    Route::prefix('system/config')->group(function () {
        Route::resource('levels', GradeLevelController::class)->names('system.config.levels');
    });

    // Students Managements.
    Route::resource('students', StudentController::class);
});

require __DIR__ . '/settings.php';
