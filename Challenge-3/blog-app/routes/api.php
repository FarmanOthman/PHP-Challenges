<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Services\AzureImageService;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Azure SAS token generation endpoint with session-based authentication
// Using auth middleware (session) instead of auth:sanctum (token)
Route::middleware(['auth', 'azure.sas', 'throttle:60,1'])
    ->get('/azure/sas-token', function (Request $request, AzureImageService $azure) {
        return response()->json(
            $azure->generateSasToken(
                $request->input('filename'), 
                $request->input('permissions', 'w'), 
                $request->input('expiry', 60)
            )
        );
    });