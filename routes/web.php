<?php

use App\Http\Controllers\Users\StudentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // System Settings

    Route::get('/school/setting', function () {
        return Inertia::render('system/settings');
    });

    // Students Managements.
    Route::resource('students', StudentController::class);
});

require __DIR__ . '/settings.php';
