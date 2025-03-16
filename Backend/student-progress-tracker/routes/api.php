<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\GradeController;
use App\Http\Controllers\MentorController;
use App\Http\Controllers\MentoringSessionController;
use App\Http\Controllers\ReminderController;
use App\Http\Controllers\CounselingCallController;

Route::apiResource('students', StudentController::class);
Route::apiResource('modules', ModuleController::class);
Route::apiResource('attendance', AttendanceController::class);
Route::apiResource('grades', GradeController::class);
Route::apiResource('mentors', MentorController::class);
Route::apiResource('mentoring-sessions', MentoringSessionController::class);
Route::apiResource('reminders', ReminderController::class);
Route::apiResource('counseling-calls', CounselingCallController::class);