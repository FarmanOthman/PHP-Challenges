# Real-Time Chat Application

A full-stack real-time messaging application built with Laravel, React, and WebSockets. This application enables instant messaging with online presence detection and typing indicators.

## Overview

This project demonstrates a modern approach to building real-time applications using Laravel and React. It features a multi-container architecture orchestrated with Docker, WebSocket communication for instant updates, and a responsive UI.

## Technology Stack

### Backend

- **PHP 8.x with Laravel 10**: Modern PHP framework for the API
- **Soketi**: WebSocket server for real-time communication
- **Laravel Sanctum**: API authentication with token support
- **Laravel Broadcasting**: Event broadcasting system
- **MySQL**: Primary database for persistent storage
- **Redis**: Cache and PubSub for real-time features

### Frontend

- **React**: UI library with functional components and hooks
- **TypeScript**: Type-safe JavaScript
- **Zustand**: Lightweight state management
- **Axios**: HTTP client for API requests
- **Pusher JS**: WebSocket client for real-time updates
- **Vite**: Modern frontend build tool

### Infrastructure

- **Docker**: Containerization of all services
- **Docker Compose**: Multi-container orchestration

## Features

- **User Authentication**: Secure register, login, and logout functionality
- **Real-time Messaging**: Instant message delivery using WebSockets
- **Group Chats**: Create and manage chat rooms with multiple users
- **Direct Messages**: One-on-one private conversations
- **Online Status**: See which users are currently online
- **Typing Indicators**: Real-time notification when someone is typing
- **Message History**: Persistent storage and retrieval of message history
- **Responsive Design**: Works on desktop and mobile devices

## Architecture

The application follows a microservices architecture with the following components:

1. **Laravel Backend**:
   - RESTful API endpoints for CRUD operations
   - WebSocket server integration for real-time event broadcasting
   - Authentication via Laravel Sanctum
   - MySQL database for data persistence

2. **React Frontend**:
   - Component-based UI
   - State management with Zustand
   - Real-time updates via Pusher JS client
   - API communication via Axios

3. **WebSocket Server (Soketi)**:
   - Standalone WebSocket server optimized for Laravel
   - Handles real-time event broadcasting
   - Supports private and presence channels
   - Enables client-to-client messaging

4. **Database Services**:
   - MySQL for persistent storage
   - Redis for caching and PubSub

## Getting Started

### Prerequisites

- Docker & Docker Compose
- Node.js & npm (for local frontend development)
- Composer (for local backend development)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd Challenge-4
   ```

2. Start the Docker containers:

   ```bash
   docker-compose up -d
   ```

3. The application services will be available at:

   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:8000`
   - WebSocket Server: `ws://localhost:6001`

### Docker Services

The application uses the following Docker containers:

- **mysql**: MySQL 8.0 database server (port 3307)
- **redis**: Redis 7.0 server (port 6380)
- **app**: Laravel application server (port 8000)
- **websocket_server**: Soketi WebSocket server (port 6001)

## Configuration

### Backend Configuration

The Laravel backend configuration is managed via environment variables in the `.env` file. Key configurations include:

```env
# Database
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=laravel_challenge_4
DB_USERNAME=laravel
DB_PASSWORD=root

# Broadcasting
BROADCAST_DRIVER=pusher
PUSHER_APP_ID=app-id
PUSHER_APP_KEY=app-key
PUSHER_APP_SECRET=app-secret
PUSHER_HOST=websocket_server
PUSHER_PORT=6001
PUSHER_SCHEME=http
PUSHER_APP_CLUSTER=mt1

# Redis
REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379
```

### Frontend Configuration

The React frontend connects to the backend API and WebSocket server with the following configuration in `socket.ts`:

```typescript
this.pusher = new Pusher('app-key', {
  wsHost: '127.0.0.1',
  wsPort: 6001,
  wssPort: 6001,
  cluster: 'mt1',
  forceTLS: false,
  enabledTransports: ['ws', 'wss'],
  authTransport: 'ajax',
  authEndpoint: '/broadcasting/auth',
  auth: { headers: { Authorization: `Bearer ${token}` } }
});
```

### API Proxying

The Vite development server proxies API requests to the Laravel backend:

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': { target: 'http://localhost:8000' },
    '/broadcasting': { target: 'http://localhost:8000' },
    '/sanctum': { target: 'http://localhost:8000' }
  }
}
```

## WebSocket Communication

The application uses Pusher-compatible WebSockets for real-time features:

1. **Message Broadcasting**: New messages are broadcasted to all users in a room
2. **Presence Channels**: Track which users are online in each room
3. **Client Events**: Support for typing indicators between clients

Example of joining a WebSocket room:

```typescript
// Join a specific chat room
joinRoom(roomId: string): void {
  if (!this.pusher || !this.connected) return;
  
  const channelName = `presence-room.${roomId}`;
  if (this.channels[channelName]) return;

  const channel = this.pusher.subscribe(channelName);
  this.channels[channelName] = channel;

  // Handle events...
}
```

## Troubleshooting

### WebSocket Connection Issues

If you encounter WebSocket connection problems:

1. Ensure the WebSocket server is running:

   ```bash
   docker ps | grep websocket_server
   ```

2. Check that client messaging is enabled in the WebSocket server:

   ```env
   SOKETI_ENABLE_CLIENT_MESSAGES: "true"
   ```

3. Verify CORS is properly configured in `backend/config/cors.php`:

   ```php
   'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout', 'register', 'broadcasting/*'],
   ```

### Message Delivery Issues

If messages aren't being sent or received:

1. Ensure the payload format is correct:

   ```typescript
   const payload = { 
     content, 
     recipient_id: String(roomId), 
     recipient_type: 'room' 
   };
   ```

2. Check browser console for WebSocket errors

3. Verify broadcasting configuration in `backend/config/broadcasting.php`

## Development

### Backend Development

To make changes to the Laravel backend:

1. Install dependencies:

   ```bash
   cd backend
   composer install
   ```

2. Run migrations:

   ```bash
   php artisan migrate
   ```

3. Start the development server:

   ```bash
   php artisan serve
   ```

### Frontend Development

To work on the React frontend:

1. Install dependencies:

   ```bash
   cd frontend
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

## Development Workflow

### Backend Development
1. Make changes to Laravel app in the `backend/` directory
2. Laravel containers will auto-reload changes

### Frontend Development
1. Make changes to React app in the `frontend/` directory
2. The Vite dev server will hot-reload changes

## WebSocket Setup

This project uses Soketi as a WebSocket server:

1. **Soketi Configuration**:
   - WebSocket server runs on port 6001
   - CORS is configured to allow frontend connections
   - Client messages are enabled for typing indicators

2. **Pusher Client Setup**:
   - Frontend connects to WebSocket server via Pusher JS client
   - Authentication via Laravel's broadcasting auth endpoint

## API Endpoints

The API follows RESTful conventions:

- **Authentication**:
  - `POST /api/register`: Register a new user
  - `POST /api/login`: Authenticate a user
  - `POST /api/logout`: Log out the current user

- **Rooms**:
  - `GET /api/rooms`: Get available chat rooms
  - `POST /api/rooms`: Create a new chat room
  - `GET /api/rooms/{id}`: Get a specific room details
  - `GET /api/rooms/{id}/messages`: Get messages for a room

- **Messages**:
  - `POST /api/messages`: Send a new message
  - `GET /api/messages`: Get user messages
  - `PUT /api/messages/{id}`: Update a message
  - `DELETE /api/messages/{id}`: Delete a message

## Project Structure

- `backend/`: Laravel application
  - `app/`: Core application code
    - `Http/Controllers/`: API controllers
    - `Events/`: WebSocket events
    - `Models/`: Database models
  - `routes/`: API routes and channel definitions
  - `config/`: Configuration files

- `frontend/`: React application
  - `src/`: Source code
    - `components/`: React components
    - `services/`: API and socket services
    - `store/`: State management
    - `pages/`: Main application pages

- `docker-compose.yml`: Docker services configuration

## Troubleshooting

### Common Issues

1. **WebSocket Connection Failed**:
   - Ensure the WebSocket server is running
   - Check CORS settings in Laravel
   - Verify the client connection parameters

2. **Authentication Issues**:
   - Check Sanctum configuration
   - Ensure cookies are properly set
   - Verify token passing in WebSocket connection

3. **Message Delivery Problems**:
   - Check event broadcasting setup
   - Verify channel subscriptions
   - Inspect WebSocket server logs

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## Acknowledgements

- Laravel Team for the excellent framework
- React Team for the UI library
- Soketi for the WebSocket server
- All other open-source contributors
