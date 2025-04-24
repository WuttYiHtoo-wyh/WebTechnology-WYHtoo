<?php

namespace App\Services;

use Google_Client;
use Google_Service_Calendar;
use Google_Service_Calendar_Event;
use Illuminate\Support\Facades\Log;
use Exception;

class CalendarService
{
    private $client;
    private $service;
    private $isInitialized = false;

    public function __construct()
    {
        try {
            $this->client = new Google_Client();
            $this->client->setApplicationName('StrategyFirst College Counselling Center');
            $this->client->setAuthConfig(storage_path('app/google-calendar/credentials.json'));
            $this->client->setAccessType('offline');
            $this->client->setPrompt('select_account consent');
            $this->client->setScopes([
                Google_Service_Calendar::CALENDAR,
                Google_Service_Calendar::CALENDAR_EVENTS,
            ]);

            // Check if we have a token and try to use it
            if (file_exists(storage_path('app/google-calendar/token.json'))) {
                $accessToken = json_decode(file_get_contents(storage_path('app/google-calendar/token.json')), true);
                $this->client->setAccessToken($accessToken);
            }

            // If token is expired, try to refresh it
            if ($this->client->isAccessTokenExpired()) {
                Log::info('[CalendarService] Access token expired, attempting to refresh');
                
                if ($this->client->getRefreshToken()) {
                    Log::info('[CalendarService] Refresh token found, refreshing access token');
                    $this->client->fetchAccessTokenWithRefreshToken($this->client->getRefreshToken());
                    
                    // Save the new token
                    file_put_contents(
                        storage_path('app/google-calendar/token.json'),
                        json_encode($this->client->getAccessToken())
                    );
                } else {
                    Log::error('[CalendarService] No refresh token available');
                    throw new Exception('No refresh token available. Please re-authenticate.');
                }
            }

            $this->service = new Google_Service_Calendar($this->client);
            $this->isInitialized = true;
            
            Log::info('[CalendarService] Successfully initialized Google Calendar service');
        } catch (Exception $e) {
            Log::error('[CalendarService] Failed to initialize calendar service', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            $this->isInitialized = false;
        }
    }

    public function isServiceInitialized()
    {
        return $this->isInitialized;
    }

    public function createEvent($eventData)
    {
        try {
            if (!$this->isInitialized) {
                throw new Exception('Calendar service not initialized');
            }

            Log::info('[CalendarService] Creating calendar event', [
                'event_data' => $eventData
            ]);

            $event = new Google_Service_Calendar_Event([
                'summary' => $eventData['summary'],
                'description' => $eventData['description'],
                'start' => $eventData['start'],
                'end' => $eventData['end'],
                'reminders' => [
                    'useDefault' => false,
                    'overrides' => [
                        ['method' => 'email', 'minutes' => 24 * 60],
                        ['method' => 'popup', 'minutes' => 60],
                    ],
                ],
            ]);

            $calendarId = 'primary';
            $event = $this->service->events->insert($calendarId, $event);

            Log::info('[CalendarService] Successfully created calendar event', [
                'event_id' => $event->getId(),
                'html_link' => $event->getHtmlLink()
            ]);

            return $event;
        } catch (Exception $e) {
            Log::error('[CalendarService] Failed to create calendar event', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }
}