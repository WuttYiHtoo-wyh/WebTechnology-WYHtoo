<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\CounsellingController;
use App\Services\CalendarService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\GoogleCalendarController;

Route::get('/', function () {
    return view('welcome');
});

// Google Calendar OAuth routes
Route::get('/auth/google', function (CalendarService $calendarService) {
    try {
        $authUrl = $calendarService->getAuthUrl();
        Log::info('Redirecting to Google auth URL', ['url' => $authUrl]);
        return redirect($authUrl);
    } catch (\Exception $e) {
        Log::error('Failed to get Google auth URL: ' . $e->getMessage());
        return redirect('/')->with('error', 'Failed to initialize Google Calendar authentication.');
    }
})->name('google.auth');

Route::get('/auth/google/callback', function (Request $request, CalendarService $calendarService) {
    try {
        Log::info('Received Google callback', ['code' => $request->has('code')]);
        if ($request->has('code')) {
            if ($calendarService->handleCallback($request->code)) {
                return redirect('/')->with('success', 'Google Calendar connected successfully!');
            }
        }
        return redirect('/')->with('error', 'Failed to connect Google Calendar.');
    } catch (\Exception $e) {
        Log::error('Failed to handle Google callback: ' . $e->getMessage());
        return redirect('/')->with('error', 'An error occurred while connecting to Google Calendar.');
    }
})->name('google.callback');

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

Route::get('/google/oauth/callback', [GoogleCalendarController::class, 'handleCallback']);
