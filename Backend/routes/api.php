<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\ProgressController;
use App\Http\Controllers\CounsellingController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\SolutionController;

// Authentication routes
Route::post('/login', [UserController::class, 'login']);
Route::post('/register', [UserController::class, 'register']);
Route::post('/logout', [UserController::class, 'logout'])->middleware('auth:sanctum');

// Public routes
Route::get('/mentors', [UserController::class, 'getMentors']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // User routes
    Route::apiResource('users', UserController::class);
    
    // Student routes
    Route::apiResource('students', StudentController::class);
    
    // Module routes
    Route::apiResource('modules', ModuleController::class);
    
    // Progress routes
    Route::apiResource('progress', ProgressController::class);
    
    // Counselling routes
    Route::apiResource('counsellings', CounsellingController::class);
    Route::get('/counselling/student/{id}', [CounsellingController::class, 'getStudentCounselling']);

    Route::get('/user', [UserController::class, 'user']);
    Route::get('/student-attendance', [AttendanceController::class, 'getStudentAttendance']);

    // Student completed modules route
    Route::get('/student/{id}/completed-modules', [AttendanceController::class, 'getCompletedModules']);

    // Student ongoing modules route
    Route::get('/student/{id}/ongoing-modules', [AttendanceController::class, 'getOngoingModules']);

    // Student upcoming modules route
    Route::get('/student/{id}/upcoming-modules', [AttendanceController::class, 'getUpcomingModules']);

    // Solution routes
    Route::post('/solutions', [SolutionController::class, 'store']);
    Route::get('/solutions/counselling/{counsellingId}', [SolutionController::class, 'getByCounsellingId']);
    Route::put('/solutions/{id}', [SolutionController::class, 'update']);
}); 