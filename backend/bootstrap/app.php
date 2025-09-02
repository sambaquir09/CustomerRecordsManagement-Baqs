<?php

use App\Http\Middleware\CorsMiddleware;
use App\http\Middleware\VerifyCsrfToken;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;


return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
    
        $middleware->validateCsrfTokens(except: [
            '/*'
            // 'api/*',  // This will exclude all routes that start with /api/
            // '/api/customers',
            // '/api/customers/*'
        ]);
    
        // Keep CORS middleware
        $middleware->append(CorsMiddleware::class);
        
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
