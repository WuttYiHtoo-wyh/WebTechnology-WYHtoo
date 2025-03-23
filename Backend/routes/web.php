<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CalendarController;
use App\Services\CalendarService;

Route::get('/', function () {
    return view('welcome');
});

// Google Calendar OAuth routes
Route::get('/oauth2callback', [CalendarController::class, 'handleCallback']);

// Test route for Google Calendar authentication
Route::get('/test-calendar-auth', function () {
    try {
        $calendarService = new CalendarService();
        return response()->json(['message' => 'Calendar service initialized successfully']);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Authentication required',
            'auth_url' => $e->getMessage(),
            'instructions' => 'Please visit the auth_url in your browser to authenticate with Google Calendar'
        ]);
    }
});
