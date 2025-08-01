# Event Management Backend API

A complete backend system for the SFMP Event Management application, built with Node.js, Express, and SQLite.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment setup:**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

4. **Setup database:**
   ```bash
   npm run setup
   ```

5. **Start the server:**
   ```bash
   npm run dev  # Development mode with auto-reload
   # or
   npm start    # Production mode
   ```

The API will be available at `http://localhost:3001`

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe",
  "role": "participant",
  "phone": "+33123456789",
  "organization": "CHU Rennes"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "participant"
  }
}
```

#### POST `/api/auth/login`
Login user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### GET `/api/auth/verify`
Verify JWT token (requires Authorization header).

### Activity Endpoints

#### GET `/api/activities`
Get all activities with optional filtering.

**Query Parameters:**
- `date` - Filter by date (YYYY-MM-DD)
- `type` - Filter by activity type
- `room` - Filter by room
- `event_id` - Filter by event (default: 1)

**Response:**
```json
[
  {
    "id": 1,
    "title": "Communication, entretien motivationnel et hésitation vaccinale",
    "subtitle": "Atelier 1",
    "date": "2025-10-15",
    "start_time": "10:30",
    "end_time": "12:00",
    "room": "Salle 1",
    "type": "atelier",
    "presenters": [
      {
        "name": "Patrick Pladys",
        "title": "Néonatologiste",
        "organization": "CHU Rennes"
      }
    ],
    "is_favorite": false,
    "is_registered": false
  }
]
```

#### GET `/api/activities/:id`
Get single activity by ID.

#### POST `/api/activities/:id/favorite`
Add activity to user's favorites (requires authentication).

#### DELETE `/api/activities/:id/favorite`
Remove activity from user's favorites (requires authentication).

#### POST `/api/activities/:id/register`
Register user for activity (requires authentication).

### User Endpoints

#### GET `/api/users/profile`
Get current user's profile (requires authentication).

#### GET `/api/users/favorites`
Get user's favorite activities (requires authentication).

#### GET `/api/users/registrations`
Get user's registered activities (requires authentication).

#### GET `/api/users`
Get all users with pagination (admin only).

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 50)
- `role` - Filter by user role
- `search` - Search in name/email

### Event Endpoints

#### GET `/api/events`
Get all events.

#### GET `/api/events/:id`
Get single event with statistics.

#### POST `/api/events`
Create new event (admin only).

### Media Endpoints

#### GET `/api/media`
Get all media files (requires authentication).

#### POST `/api/media/upload`
Upload media file (admin/speaker only).

#### DELETE `/api/media/:id`
Delete media file (admin only).

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles
- `participant` - Regular attendees
- `speaker` - Workshop/conference presenters
- `admin` - Full system access

## 🗄️ Database Schema

### Main Tables
- `users` - User accounts and profiles
- `events` - Event information
- `activities` - Workshops, conferences, sessions
- `presenters` - Speaker information
- `activity_presenters` - Many-to-many relationship
- `registrations` - User activity registrations
- `favorites` - User favorite activities
- `media` - File uploads

## 🧪 Testing

### Sample API Calls

**Register a user:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "first_name": "Test",
    "last_name": "User",
    "role": "participant"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Get activities (with authentication):**
```bash
curl -X GET http://localhost:3001/api/activities \
  -H "Authorization: Bearer <your-token>"
```

**Add to favorites:**
```bash
curl -X POST http://localhost:3001/api/activities/1/favorite \
  -H "Authorization: Bearer <your-token>"
```

### Default Test Credentials

The setup script creates these default users:

1. **Admin User:**
   - Email: `admin@sfmp.fr`
   - Password: `password123`
   - Role: `admin`

2. **Regular User:**
   - Email: `user@example.com`
   - Password: `password123`
   - Role: `participant`

3. **Speaker:**
   - Email: `speaker@example.com`
   - Password: `password123`
   - Role: `speaker`

## 🔧 Configuration

### Environment Variables

- `DATABASE_PATH` - SQLite database file path
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `CORS_ORIGINS` - Allowed CORS origins
- `MAX_FILE_SIZE` - Maximum upload file size
- `UPLOAD_PATH` - Directory for uploaded files

### Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Configure proper CORS origins
4. Set up file upload limits
5. Consider using PostgreSQL for production

## 📝 Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message",
  "errors": [...] // Validation errors array if applicable
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## 🚀 Next Steps

1. **Connect Frontend:** Update your React app to use these API endpoints
2. **Add Tests:** Implement comprehensive test suite
3. **Add Logging:** Integrate proper logging system
4. **Add Monitoring:** Set up health checks and metrics
5. **Add Caching:** Implement Redis for session/data caching
6. **Add Email:** Set up email notifications for registrations

## 📞 Support

For questions or issues, please check the API documentation or contact the development team.