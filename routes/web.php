<?php

use App\Http\Controllers\DemoController;
use App\Http\Controllers\Attendance\AttendanceListController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

$app_name = env('APP_NAME', '');

// Authentication routes
require __DIR__ . '/auth.php';

// General routes
require __DIR__ . '/general.php';

Route::get("/attendance-index", [AttendanceListController::class, 'index'])->name('attendance.index');

Route::post('/store', [AttendanceListController::class, 'store'])->name('attendance.store');
Route::post('/update/{id}', [AttendanceListController::class, 'update'])->name('attendance.update');
Route::delete('/attendance/{id}', [AttendanceListController::class, 'destroy'])->name('attendance.destroy');

Route::fallback(function () {
    return Inertia::render('404');
})->name('404');
