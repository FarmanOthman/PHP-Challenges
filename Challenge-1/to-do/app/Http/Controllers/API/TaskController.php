<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $user = auth()->user();
        $tasks = Task::where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();

        Log::channel('tasks')->info('Tasks list accessed', [
            'user_id' => $user->id,
            'task_count' => $tasks->count(),
        ]);

        return response()->json([
            'tasks' => $tasks
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:pending,in_progress,completed',
            'due_date' => 'nullable|date',
            'is_important' => 'boolean',
        ]);

        // Associate task with authenticated user
        $validated['user_id'] = auth()->id();

        $task = Task::create($validated);
        
        // Log task creation
        Log::channel('tasks')->info('Task created', [
            'user_id' => auth()->id(),
            'task_id' => $task->id,
            'task_title' => $task->title,
        ]);
        
        return response()->json([
            'message' => 'Task created successfully',
            'task' => $task
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task): JsonResponse
    {
        // Ensure user can only access their own tasks
        if (Gate::denies('view', $task)) {
            Log::channel('tasks')->warning('Unauthorized task access attempt', [
                'user_id' => auth()->id(),
                'task_id' => $task->id,
                'action' => 'view',
            ]);
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        Log::channel('tasks')->info('Task viewed', [
            'user_id' => auth()->id(),
            'task_id' => $task->id,
        ]);

        return response()->json([
            'task' => $task
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $task): JsonResponse
    {
        // Ensure user can only update their own tasks
        if (Gate::denies('update', $task)) {
            Log::channel('tasks')->warning('Unauthorized task access attempt', [
                'user_id' => auth()->id(),
                'task_id' => $task->id,
                'action' => 'update',
            ]);
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|required|in:pending,in_progress,completed',
            'due_date' => 'nullable|date',
            'is_important' => 'boolean',
        ]);

        // Log which fields are being updated
        $changedFields = [];
        foreach ($validated as $key => $value) {
            if ($task->$key != $value) {
                $changedFields[$key] = [
                    'from' => $task->$key,
                    'to' => $value
                ];
            }
        }

        $task->update($validated);
        
        Log::channel('tasks')->info('Task updated', [
            'user_id' => auth()->id(),
            'task_id' => $task->id,
            'changed_fields' => $changedFields,
        ]);
        
        return response()->json([
            'message' => 'Task updated successfully',
            'task' => $task
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task): JsonResponse
    {
        // Ensure user can only delete their own tasks
        if (Gate::denies('delete', $task)) {
            Log::channel('tasks')->warning('Unauthorized task access attempt', [
                'user_id' => auth()->id(),
                'task_id' => $task->id,
                'action' => 'delete',
            ]);
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Store task details before deletion for logging
        $taskDetails = [
            'id' => $task->id,
            'title' => $task->title,
            'status' => $task->status,
        ];

        $task->delete();
        
        Log::channel('tasks')->info('Task deleted', [
            'user_id' => auth()->id(),
            'task_details' => $taskDetails,
        ]);
        
        return response()->json([
            'message' => 'Task deleted successfully'
        ]);
    }
}
