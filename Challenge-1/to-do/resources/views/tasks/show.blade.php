@extends('layouts.app')

@section('title', $task->title)

@section('content')
    <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
            <h1>
                @if($task->is_important)
                    <span class="badge bg-danger me-1">Important</span>
                @endif
                {{ $task->title }}
            </h1>
            <div>
                <a href="{{ route('tasks.edit', $task) }}" class="btn btn-warning">Edit Task</a>
                <form action="{{ route('tasks.destroy', $task) }}" method="POST" class="d-inline">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="btn btn-danger" onclick="return confirm('Are you sure you want to delete this task?')">Delete Task</button>
                </form>
            </div>
        </div>
        <div class="card-body">
            <div class="row mb-3">
                <div class="col-md-6">
                    <h5>Status</h5>
                    @if($task->status === 'pending')
                        <span class="badge bg-warning text-dark">Pending</span>
                    @elseif($task->status === 'in_progress')
                        <span class="badge bg-info">In Progress</span>
                    @else
                        <span class="badge bg-success">Completed</span>
                    @endif
                </div>
                <div class="col-md-6">
                    <h5>Due Date</h5>
                    <p>{{ $task->due_date ? $task->due_date->format('F d, Y') : 'No due date set' }}</p>
                </div>
            </div>

            <div class="mb-4">
                <h5>Description</h5>
                <p class="card-text">{{ $task->description ?? 'No description provided.' }}</p>
            </div>

            <div class="row text-muted">
                <div class="col-md-6">
                    <small>Created: {{ $task->created_at->format('F d, Y \a\t g:i A') }}</small>
                </div>
                <div class="col-md-6">
                    <small>Last Updated: {{ $task->updated_at->format('F d, Y \a\t g:i A') }}</small>
                </div>
            </div>
        </div>
        <div class="card-footer">
            <a href="{{ route('tasks.index') }}" class="btn btn-secondary">Back to All Tasks</a>
        </div>
    </div>
@endsection