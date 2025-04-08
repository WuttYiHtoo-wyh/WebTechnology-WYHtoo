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
    protected $calendarId;
    protected $tokenPath;
    protected $credentialsPath;

    public function __construct()
    {
        try {
            // Set paths for token and credentials
            $this->tokenPath = storage_path('app/google-calendar-token.json');
            $this->credentialsPath = storage_path('app/google-calendar-credentials.json');

            Log::info('Initializing CalendarService', [
                'token_path' => $this->tokenPath,
                'credentials_path' => $this->credentialsPath
            ]);

            // Store credentials if they don't exist
            if (!file_exists($this->credentialsPath)) {
                Log::info('Creating credentials file');
                $credentials = [
                    'installed' => [
                        'client_id' => '1060839954891-kto1ac359u361pjuftcj9jl5rhs8hcbu.apps.googleusercontent.com',
                        'project_id' => 'warm-agility-454614-j5',
                        'auth_uri' => 'https://accounts.google.com/o/oauth2/auth',
                        'token_uri' => 'https://oauth2.googleapis.com/token',
                        'auth_provider_x509_cert_url' => 'https://www.googleapis.com/oauth2/v1/certs',
                        'client_secret' => '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',
                        'redirect_uris' => ['http://localhost:8000/auth/google/callback']
                    ]
                ];
                file_put_contents($this->credentialsPath, json_encode($credentials));
                Log::info('Credentials file created successfully');
            }

            // Initialize Google Client
            $this->client = new Google_Client();
            $this->client->setAuthConfig($this->credentialsPath);
            $this->client->addScope(Google_Service_Calendar::CALENDAR);
            $this->client->addScope(Google_Service_Calendar::CALENDAR_EVENTS);
            $this->client->setAccessType('offline');
            $this->client->setPrompt('consent');
            $this->client->setRedirectUri('http://localhost:8000/auth/google/callback');
            $this->client->setIncludeGrantedScopes(true);
            
            // Configure SSL certificate verification
            $this->client->setHttpClient(new \GuzzleHttp\Client([
                'verify' => false, // Disable SSL verification for development
                'timeout' => 30,
            ]));

            Log::info('Google Client initialized with scopes and redirect URI');

            // Load and validate token
            $token = $this->loadToken();
            if ($token) {
                $this->client->setAccessToken($token);
                if ($this->client->isAccessTokenExpired() && $this->client->getRefreshToken()) {
                    $newToken = $this->client->fetchAccessTokenWithRefreshToken($this->client->getRefreshToken());
                    $this->storeToken($newToken);
                    $this->client->setAccessToken($newToken);
                }
                $this->service = new Google_Service_Calendar($this->client);
                $this->calendarId = 'primary'; // Use the primary calendar
                Log::info('Calendar service initialized successfully');
            } else {
                Log::warning('No token found, authentication required');
            }
        } catch (\Exception $e) {
            Log::error('Failed to initialize CalendarService: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            throw $e;
        }
    }

    /**
     * Load token from storage and handle expiration
     */
    protected function loadToken()
    {
        if (file_exists($this->tokenPath)) {
            $token = json_decode(file_get_contents($this->tokenPath), true);
            Log::info('Token loaded from file', ['token_path' => $this->tokenPath]);
            return $token;
        }
        Log::info('No token file found at: ' . $this->tokenPath);
        return null;
    }

    /**
     * Create a calendar event
     */
    public function createEvent($eventData)
    {
        try {
            if (!$this->service) {
                Log::error('Calendar service not initialized');
                return null;
            }

            // Log the event data for debugging
            Log::info('Creating calendar event with data:', [
                'summary' => $eventData['summary'],
                'description' => $eventData['description'],
                'start' => $eventData['start'],
                'end' => $eventData['end'],
                'attendees' => $eventData['attendees']
            ]);

            $event = new Google_Service_Calendar_Event([
                'summary' => $eventData['summary'],
                'description' => $eventData['description'],
                'start' => $eventData['start'],
                'end' => $eventData['end'],
                'attendees' => array_map(function($attendee) {
                    return [
                        'email' => $attendee['email'],
                        'responseStatus' => 'needsAction'
                    ];
                }, $eventData['attendees']),
                'reminders' => [
                    'useDefault' => false,
                    'overrides' => [
                        ['method' => 'email', 'minutes' => 24 * 60], // 24 hours before
                        ['method' => 'email', 'minutes' => 60], // 1 hour before
                    ],
                ],
                'guestsCanSeeOtherGuests' => true,
                'guestsCanModify' => false,
                'transparency' => 'opaque',
                'visibility' => 'public',
                'sendUpdates' => 'all',
                'sendNotifications' => true,
            ]);

            $createdEvent = $this->service->events->insert($this->calendarId, $event, [
                'sendUpdates' => 'all',
                'conferenceDataVersion' => 1,
                'sendNotifications' => true,
            ]);

            // Log the created event details
            Log::info('Calendar event created successfully', [
                'event_id' => $createdEvent->getId(),
                'html_link' => $createdEvent->htmlLink,
                'attendees' => array_map(function($attendee) {
                    return [
                        'email' => $attendee->getEmail(),
                        'response_status' => $attendee->getResponseStatus()
                    ];
                }, $createdEvent->getAttendees()),
                'organizer' => $createdEvent->getOrganizer() ? [
                    'email' => $createdEvent->getOrganizer()->getEmail(),
                    'display_name' => $createdEvent->getOrganizer()->getDisplayName()
                ] : null
            ]);

            return $createdEvent;
        } catch (\Exception $e) {
            Log::error('Failed to create calendar event: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return null;
        }
    }

    /**
     * Generate Google OAuth authorization URL
     */
    public function getAuthUrl()
    {
        try {
            $authUrl = $this->client->createAuthUrl();
            Log::info('Generated Google auth URL', ['url' => $authUrl]);
            return $authUrl;
        } catch (\Exception $e) {
            Log::error('Failed to create auth URL: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Handle OAuth callback and store token
     */
    public function handleCallback($code)
    {
        try {
            $token = $this->client->fetchAccessTokenWithAuthCode($code);
            if (isset($token['error'])) {
                Log::error('Error fetching access token', ['error' => $token['error']]);
                return false;
            }

            $this->client->setAccessToken($token);
            $this->storeToken($token);
            
            // Initialize service after token is stored
            $this->service = new Google_Service_Calendar($this->client);
            $this->calendarId = 'primary';
            Log::info('Calendar service initialized after callback');
            return true;
        } catch (\Exception $e) {
            Log::error('Failed to handle Google callback: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Store token to file
     */
    protected function storeToken($token)
    {
        try {
            // Ensure the directory exists
            $directory = dirname($this->tokenPath);
            if (!file_exists($directory)) {
                mkdir($directory, 0755, true);
            }
            
            // Write the token file
            if (file_put_contents($this->tokenPath, json_encode($token))) {
                Log::info('Stored Google Calendar token', ['token_path' => $this->tokenPath]);
                return true;
            } else {
                Log::error('Failed to write token file', ['token_path' => $this->tokenPath]);
                return false;
            }
        } catch (\Exception $e) {
            Log::error('Error storing token: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Check if the service is initialized
     */
    public function isServiceInitialized()
    {
        return !empty($this->service);
    }
}