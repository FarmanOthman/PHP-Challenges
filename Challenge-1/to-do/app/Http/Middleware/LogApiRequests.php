<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class LogApiRequests
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Start timing the request
        $startTime = microtime(true);
        
        // Process the request
        $response = $next($request);
        
        // Calculate execution time
        $executionTime = microtime(true) - $startTime;
        
        // Create log data array
        $logData = [
            'ip' => $request->ip(),
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'user_id' => auth()->id() ?? 'guest',
            'status_code' => $response->getStatusCode(),
            'execution_time' => number_format($executionTime * 1000, 2) . ' ms',
            'user_agent' => $request->header('User-Agent'),
        ];
        
        // Add request data for non-GET requests (excluding passwords)
        if ($request->method() !== 'GET') {
            $input = $request->except(['password', 'password_confirmation']);
            $logData['request_data'] = !empty($input) ? json_encode($input) : 'No input data';
        }
        
        // Create log message
        $message = "{$logData['method']} {$logData['url']} - {$logData['status_code']} - {$logData['execution_time']}";
        
        // Determine log level based on status code
        $level = 'info';
        if ($response->getStatusCode() >= 500) {
            $level = 'error';
        } elseif ($response->getStatusCode() >= 400) {
            $level = 'warning';
        }
        
        // Log the request
        Log::channel('api')->$level($message, $logData);
        
        return $response;
    }
}