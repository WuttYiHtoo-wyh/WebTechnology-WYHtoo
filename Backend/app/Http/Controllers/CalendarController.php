<?php

namespace App\Http\Controllers;

use Google_Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CalendarController extends Controller
{
    public function handleCallback(Request $request)
    {
        try {
            $client = new Google_Client();
            $client->setAuthConfig(storage_path('app/google-calendar-credentials.json'));
            
            // Disable SSL verification for development
            $client->setHttpClient(new \GuzzleHttp\Client([
                'verify' => false
            ]));

            $client->setAccessType('offline');
            $client->setPrompt('consent');
            $client->setRedirectUri('http://localhost:8000/oauth2callback');

            // Get the authorization code from the callback
            $code = $request->get('code');
            if (!$code) {
                throw new \Exception('No authorization code received');
            }

            // Exchange the authorization code for an access token
            $accessToken = $client->fetchAccessTokenWithAuthCode($code);
            
            // Store the token
            file_put_contents(storage_path('app/token.json'), json_encode($accessToken));

            return response()->json([
                'message' => 'Successfully authenticated with Google Calendar'
            ]);
        } catch (\Exception $e) {
            Log::error('Calendar authentication failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to authenticate with Google Calendar',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 