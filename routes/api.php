<?php

use App\Http\Controllers\Support\AddressController;
use App\Http\Controllers\Users\StudentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/students', [StudentController::class, 'search']);
Route::get('/address/search', [AddressController::class, 'search']);