<?php

namespace App\Services;

use Google_Client;
use Google_Service_Calendar;
use Google_Service_Calendar_Event;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class CalendarService
{
    protected $client;
    protected $service;

    public function __construct()
    {
        try {
            $this->client = new Google_Client();
            $credentialsPath = storage_path('app/google-calendar-credentials.json');
            
            if (!file_exists($credentialsPath)) {
                Log::error('Google Calendar credentials file not found at: ' . $credentialsPath);
                throw new \Exception('Calendar credentials not found');
            }

            // Disable SSL verification for development
            $this->client->setHttpClient(new \GuzzleHttp\Client([
                'verify' => false
            ]));

            $this->client->setAuthConfig($credentialsPath);
            $this->client->setAccessType('offline');
            $this->client->setPrompt('consent');
            $this->client->addScope(Google_Service_Calendar::CALENDAR);
            
            // Set the redirect URI
            $this->client->setRedirectUri('http://localhost:8000/oauth2callback');
            
            // Check if we have a stored token
            $tokenPath = storage_path('app/token.json');
            if (file_exists($tokenPath)) {
                $accessToken = json_decode(file_get_contents($tokenPath), true);
                $this->client->setAccessToken($accessToken);
            }

            // If the token is expired, refresh it
            if ($this->client->isAccessTokenExpired()) {
                if ($this->client->getRefreshToken()) {
                    $this->client->fetchAccessTokenWithRefreshToken($this->client->getRefreshToken());
                    file_put_contents($tokenPath, json_encode($this->client->getAccessToken()));
                } else {
                    // If no refresh token, we need to authenticate
                    $authUrl = $this->client->createAuthUrl();
                    Log::info('Google Calendar Auth URL: ' . $authUrl);
                    throw new \Exception($authUrl);
                }
            }

            $this->service = new Google_Service_Calendar($this->client);
            Log::info('Calendar service initialized successfully');
        } catch (\Exception $e) {
            Log::error('Calendar service initialization failed: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            throw $e;
        }
    }

    public function createEvent($title, $description, $startDateTime, $endDateTime, $attendees)
    {
        try {
            Log::info('Creating calendar event with details:', [
                'title' => $title,
                'description' => $description,
                'start' => $startDateTime,
                'end' => $endDateTime,
                'attendees' => $attendees
            ]);

            // Validate input parameters
            if (empty($title) || empty($startDateTime) || empty($endDateTime)) {
                Log::error('Missing required parameters for calendar event');
                return null;
            }

            // Ensure the client is authenticated
            if ($this->client->isAccessTokenExpired()) {
                Log::info('Access token expired, attempting to refresh');
                if ($this->client->getRefreshToken()) {
                    $this->client->fetchAccessTokenWithRefreshToken($this->client->getRefreshToken());
                    $tokenPath = storage_path('app/token.json');
                    file_put_contents($tokenPath, json_encode($this->client->getAccessToken()));
                    Log::info('Access token refreshed successfully');
                } else {
                    Log::error('No refresh token available');
                    return null;
                }
            }

            // Create the event with all necessary details
            $attendees = array_map(function($email) {
                Log::info('Adding attendee:', ['email' => $email]);
                return [
                    'email' => $email,
                    'responseStatus' => 'needsAction',
                ];
            }, array_filter($attendees));

            Log::info('Final attendees array:', ['attendees' => $attendees]);

            $event = new Google_Service_Calendar_Event([
                'summary' => 'StrategyFirst College Counselling Center - ' . $title,
                'description' => $description,
                'start' => [
                    'dateTime' => $startDateTime,
                    'timeZone' => 'Asia/Kuala_Lumpur',
                ],
                'end' => [
                    'dateTime' => $endDateTime,
                    'timeZone' => 'Asia/Kuala_Lumpur',
                ],
                'organizer' => [
                    'email' => 'strategyfirst@example.com',
                    'displayName' => 'StrategyFirst College Counselling Center'
                ],
                'attendees' => $attendees,
                'reminders' => [
                    'useDefault' => false,
                    'overrides' => [
                        ['method' => 'email', 'minutes' => 24 * 60], // 24 hours before
                        ['method' => 'email', 'minutes' => 60],      // 1 hour before
                    ],
                ],
            ]);

            Log::info('Attempting to insert calendar event with attendees:', [
                'attendees' => $event->getAttendees()
            ]);

            Log::info('Attempting to insert calendar event');
            $event = $this->service->events->insert('primary', $event, [
                'sendUpdates' => 'all', // This ensures all attendees receive the invitation
            ]);

            Log::info('Calendar event created successfully with ID: ' . $event->getId());
            Log::info('Event details: ' . json_encode($event));
            return $event->getId();
        } catch (\Google_Service_Exception $e) {
            Log::error('Google Calendar API Error: ' . $e->getMessage());
            Log::error('Error Code: ' . $e->getCode());
            Log::error('Error Details: ' . json_encode($e->getErrors()));
            return null;
        } catch (\Exception $e) {
            Log::error('Calendar event creation failed: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return null;
        }
    }
} 