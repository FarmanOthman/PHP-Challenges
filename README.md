# Laravel-React Full-Stack Challenges 🚀

## 🎯 Challenges Overview

### 1. To-Do List Application
A full-stack task management application with:
- Laravel API backend
- React frontend with modern UI
- CRUD operations for tasks
- Task categorization (Pending/Completed)
- Responsive design using TailwindCSS

### 2. User Authentication System
Enhanced security and user management featuring:
- Laravel Sanctum for API authentication
- User registration and login
- Protected routes in React
- Global state management with Context API or Redux
- Secure API endpoints with middleware

### 3. Blog Application
A feature-rich blogging platform with:
- Post and comment functionality
- Markdown support
- Efficient data caching with Laravel
- Infinite scroll/pagination
- Rich text editing with Tiptap or similar

### 4. Real-Time Chat
Modern real-time communication implementation using:
- Laravel Echo with Pusher or Laravel Websockets
- Real-time message updates
- Redis for broadcasting
- Elegant UI with Material-UI/Chakra UI

## 🛠️ Technologies Used

### Backend
- Laravel 10+
- Laravel Sanctum (for API auth)
- Laravel Echo (for real-time)
- Pusher/Laravel Websockets
- Redis
- MySQL/PostgreSQL

### Frontend
- React 18+
- React Router v6
- Axios
- React Query/SWR
- Laravel Echo (Socket.IO alternative)
- TailwindCSS
- Material-UI/Chakra UI (optional)

## 📋 Prerequisites

- PHP 8.1+
- Composer
- Node.js 16+
- npm/yarn/pnpm
- Redis (for Challenge 4)
- Git
- MySQL/PostgreSQL

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/laravel-react-challenges.git
cd laravel-react-challenges
```

2. Each challenge has its own README with specific setup instructions.
3. Navigate to the challenge you want to work on:
```bash
cd Challenge-1  # or Challenge-2, Challenge-3, Challenge-4
```

## 📁 Project Structure

```
laravel-react-challenges/
├── Challenge-1/          # To-Do List Application
│   ├── laravel/         # Laravel backend
│   └── react/          # React frontend
├── Challenge-2/          # User Authentication
│   ├── laravel/
│   └── react/
├── Challenge-3/          # Blog Application
│   ├── laravel/
│   └── react/
└── Challenge-4/          # Real-Time Chat
    ├── laravel/
    └── react/
```

## 🎓 Learning Outcomes

- Full-stack application architecture with Laravel
- REST API development with Laravel
- Modern React development practices
- Authentication with Laravel Sanctum
- Real-time communication with Laravel Echo
- State management in React
- Eloquent ORM relationships
- Performance optimization
- Modern UI/UX implementation

## Detailed Challenge Breakdown

### Challenge 1: To-Do List Application

**Backend (Laravel):**
1. Set up Laravel project
2. Create Task model and migration
3. Create API routes
4. Implement TaskController with CRUD operations
5. Set up CORS middleware

**Frontend (React):**
1. Create React app
2. Implement task listing
3. Create forms for adding/editing tasks
4. Implement task status toggling
5. Add responsive styling with TailwindCSS

### Challenge 2: User Authentication System

**Backend (Laravel):**
1. Set up Laravel Sanctum
2. Create AuthController for registration/login
3. Implement protected routes
4. Create user model relationships
5. Set up password reset functionality

**Frontend (React):**
1. Create auth context/provider
2. Implement registration/login forms
3. Create protected routes
4. Add auth state persistence
5. Implement logout functionality

### Challenge 3: Blog Application

**Backend (Laravel):**
1. Create Post and Comment models
2. Implement API resources for relationships
3. Add markdown support
4. Implement caching for popular posts
5. Create pagination endpoints

**Frontend (React):**
1. Implement post listing with infinite scroll
2. Create rich text editor
3. Add comment functionality
4. Implement markdown rendering
5. Add category filtering

### Challenge 4: Real-Time Chat

**Backend (Laravel):**
1. Set up Laravel Echo
2. Configure broadcasting (Pusher or Laravel Websockets)
3. Create Message model
4. Implement event broadcasting
5. Set up presence channels for online users

**Frontend (React):**
1. Set up Laravel Echo client
2. Implement chat interface
3. Add real-time message updates
4. Create typing indicators
5. Add online user list

## 🤝 Contributing

Follow the same pattern as your Django version:
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

MIT License (same as your Django version)

## 👏 Acknowledgments

- Laravel Documentation
- React Documentation
- Laravel Sanctum Documentation
- Laravel Echo Documentation
- TailwindCSS Documentation