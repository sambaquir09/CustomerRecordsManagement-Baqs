<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CustomerController;

Route::get('/', function () {
    return view('welcome');
});

// API Routes group with prefix
Route::prefix('api')->group(function () {
    // Customer CRUD routes
    Route::controller(CustomerController::class)->group(function () {
        Route::get('/customers', 'index');     // List all customers + Search
        Route::get('/customers/{id}', 'show'); // View a customer
        Route::post('/customers', 'store');    // Create a customer
        Route::put('/customers/{id}', 'update');    // Update a customer
        Route::delete('/customers/{id}', 'destroy'); // Delete a customer
    });
});
