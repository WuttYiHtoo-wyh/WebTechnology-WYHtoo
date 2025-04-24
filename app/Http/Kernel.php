<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    /**
     * The application's global HTTP middleware stack.
     *
     * These middleware are run during every request to your application.
     *
     * @var array<int, class-string|string>
     */
    protected $middleware = [
        // ...
        \App\Http\Middleware\Cors::class,
    ];

    /**
     * The application's route middleware groups.
     *
     * @var array<string, array<int, class-string|string>>
     */
    protected $middlewareGroups = [
        'web' => [
            // Web middleware group
        ],

        'api' => [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
            // ...
        ],
    ];

    /**
     * Configure the rate limiters for the application.
     *
     * @var array<string, int|array<int, string|int>>
     */
    protected $rateLimiters = [
        // Rate limiters configuration
    ];

    /**
     * Configure the application's route model bindings, pattern filters, etc.
     *
     * @var array<string, class-string|string>
     */
    protected $routeMiddleware = [
        // Route middleware configuration
    ];
} 