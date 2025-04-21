<?php

use App\Http\Controllers\ConversationController;
use App\Http\Controllers\GenerationImageController;
use App\Http\Controllers\RecognizeImageController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('customAuth')->group(function () {
    Route::withoutMiddleware('customAuth')->group(function () {
        Route::post('user/create', [UserController::class, 'create']);
        Route::post('user/login', [UserController::class, 'login']);
    });
    Route::prefix('conversation')->group(function () {
        Route::post('', [ConversationController::class, 'create']);
        Route::get('/{id}', [ConversationController::class, 'get']);
        Route::post('/{id}', [ConversationController::class, 'update']);
    });

    Route::prefix('generation-image')->group(function () {
        Route::post('/generate', [GenerationImageController::class, 'create']);
        Route::get('/status/{id}', [GenerationImageController::class, 'getStatus']);
        Route::get('/result/{id}', [GenerationImageController::class, 'getResult']);
    });

    Route::prefix('recognize')->group(function () {
        Route::post('', [RecognizeImageController::class, 'recognize']);
    });

    Route::prefix('user')->group(function () {
        Route::post('/logout', [UserController::class, 'logout']);
        Route::get('/token', [UserController::class, 'getToken']);
    });
});
