<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Google_Client;
use Google_Service_Calendar;
use Illuminate\Support\Facades\Log;
use Exception;

class GoogleCalendarController extends Controller
{
    public function handleCallback(Request $request)
    {
        try {
            $client = new Google_Client();
            $client->setAuthConfig(storage_path('app/google-calendar/credentials.json'));
            $client->setRedirectUri('http://localhost/google/oauth/callback');
            $client->setAccessType('offline');
            $client->setPrompt('consent select_account');
            $client->setScopes([
                Google_Service_Calendar::CALENDAR,
                Google_Service_Calendar::CALENDAR_EVENTS,
            ]);

            if ($request->has('code')) {
                $token = $client->fetchAccessTokenWithAuthCode($request->get('code'));
                if (!isset($token['error'])) {
                    file_put_contents(
                        storage_path('app/google-calendar/token.json'),
                        json_encode($token)
                    );
                    return 'Calendar authentication successful! You can close this window.';
                }
            }

            return 'Authentication failed!';
        } catch (Exception $e) {
            Log::error('Google Calendar authentication failed', [
                'error' => $e->getMessage()
            ]);
            return 'Authentication failed: ' . $e->getMessage();
        }
    }
} 