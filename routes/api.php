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
use App\Http\Controllers\MentorController;

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
    Route::get('/student-statistics', [StudentController::class, 'statistics']);
    Route::get('/students', [StudentController::class, 'index']);
    Route::get('/students/{student}', [StudentController::class, 'show']);
    Route::put('/students/{student}', [StudentController::class, 'update']);
    Route::get('/students/{student}/modules', [StudentController::class, 'getModules']);
    Route::post('/students/{student}/counseling-requests', [StudentController::class, 'submitCounselingRequest']);
    Route::post('/test-email', [StudentController::class, 'testEmail']);
    
    // Module routes
    Route::apiResource('modules', ModuleController::class);
    
    // Progress routes
    Route::apiResource('progress', ProgressController::class);
    
    // Counselling routes
    Route::apiResource('counsellings', CounsellingController::class);
    Route::get('/counselling/student/{id}', [CounsellingController::class, 'getStudentCounselling']);
    Route::get('/counselling-statistics', [CounsellingController::class, 'statistics']);
    Route::get('/counselling-overview', [CounsellingController::class, 'overview']);
    Route::get('/counselling-requests', [StudentController::class, 'getCounselingRequests']);
    Route::post('/counselling-requests', [CounsellingController::class, 'submitRequest']);
    Route::put('/counselling-requests/{id}', [CounsellingController::class, 'updateRequestStatus']);

    Route::get('/user', [UserController::class, 'user']);
    Route::get('/student-attendance', [AttendanceController::class, 'getStudentAttendance']);

    // Student completed modules route
    Route::get('/student/{id}/completed-modules', [AttendanceController::class, 'getCompletedModules']);
    Route::get('/student/{id}/completed-modules-details', [AttendanceController::class, 'getCompletedModulesWithDetails']);

    // Student ongoing modules route
    Route::get('/student/{id}/ongoing-modules', [AttendanceController::class, 'getOngoingModules']);

    // Student upcoming modules route
    Route::get('/student/{id}/upcoming-modules', [AttendanceController::class, 'getUpcomingModules']);

    // Solution routes
    Route::post('/solutions', [SolutionController::class, 'store']);
    Route::get('/solutions/counselling/{counsellingId}', [SolutionController::class, 'getByCounsellingId']);
    Route::put('/solutions/{id}', [SolutionController::class, 'update']);

    Route::get('/mentor/student-attendance-stats', [MentorController::class, 'getStudentAttendanceStats']);

    // Mentor routes
    Route::get('/mentors/{mentor}/counseling-requests', [MentorController::class, 'getCounselingRequests'])
        ->where('mentor', '[0-9]+');

    Route::post('/users/import', [UserController::class, 'import']);
}); 