@extends('layouts.app')

@section('title', 'All Tasks')

@section('content')
    <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
            <h1>Tasks</h1>
            <a href="{{ route('tasks.create') }}" class="btn btn-primary">Add New Task</a>
        </div>
        <div class="card-body">
            @if($tasks->isEmpty())
                <div class="alert alert-info">No tasks found. Create your first task!</div>
            @else
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Due Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($tasks as $task)
                            <tr>
                                <td>{{ $task->id }}</td>
                                <td>
                                    @if($task->is_important)
                                        <span class="badge bg-danger me-1">Important</span>
                                    @endif
                                    {{ $task->title }}
                                </td>
                                <td>
                                    @if($task->status === 'pending')
                                        <span class="badge bg-warning text-dark">Pending</span>
                                    @elseif($task->status === 'in_progress')
                                        <span class="badge bg-info">In Progress</span>
                                    @else
                                        <span class="badge bg-success">Completed</span>
                                    @endif
                                </td>
                                <td>{{ $task->due_date ? $task->due_date->format('M d, Y') : 'No due date' }}</td>
                                <td>
                                    <div class="btn-group">
                                        <a href="{{ route('tasks.show', $task) }}" class="btn btn-sm btn-info">View</a>
                                        <a href="{{ route('tasks.edit', $task) }}" class="btn btn-sm btn-warning">Edit</a>
                                        <form action="{{ route('tasks.destroy', $task) }}" method="POST" class="d-inline">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="btn btn-sm btn-danger" onclick="return confirm('Are you sure you want to delete this task?')">Delete</button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            @endif
        </div>
    </div>
@endsection