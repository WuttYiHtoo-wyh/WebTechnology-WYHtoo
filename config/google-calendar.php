<?php

return [
    /*
     * The client ID from the Google Developer Console.
     */
    'client_id' => env('GOOGLE_CALENDAR_CLIENT_ID'),

    /*
     * The client secret from the Google Developer Console.
     */
    'client_secret' => env('GOOGLE_CALENDAR_CLIENT_SECRET'),

    /*
     * The redirect URI that was used when registering the application.
     */
    'redirect_uri' => env('GOOGLE_CALENDAR_REDIRECT_URI'),

    /*
     * The calendar ID to use for creating events.
     */
    'calendar_id' => 'primary',

    /*
     * The scopes to request from the Google API.
     */
    'scopes' => [
        \Google_Service_Calendar::CALENDAR,
        \Google_Service_Calendar::CALENDAR_EVENTS,
    ],

    /*
     * The token file path where the access token will be stored.
     */
    'token_path' => storage_path('app/google-calendar-token.json'),

    /*
     * The credentials file path where the client credentials will be stored.
     */
    'credentials_path' => storage_path('app/google-calendar-credentials.json'),

    'access_type' => 'offline',
    'approval_prompt' => 'force',
    'prompt' => 'consent select_account'
]; 