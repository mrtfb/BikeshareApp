# BikeshareApp

A comprehensive bikeshare management application built with React (frontend) and Node.js (backend), designed for mobile deployment using Capacitor.

## Features

- **User Management**: Create, view, and manage system users
- **Dock Management**: Manage docking stations with location and capacity tracking
- **Bike Management**: Track bikes, battery levels, charging status, and availability
- **Real-time Updates**: MQTT integration for real-time status updates
- **Mobile Ready**: Built with Capacitor for iOS and Android deployment
- **Database Integration**: MariaDB support for data persistence

## Architecture

### Backend (Node.js + Express)
- RESTful API with comprehensive endpoints
- MariaDB database integration
- MQTT client for real-time communication
- Modular architecture with controllers, models, and routes

### Frontend (React + TypeScript)
- Modern React application with TypeScript
- Responsive design for mobile and desktop
- Capacitor integration for native mobile compilation
- Comprehensive UI for all management features

## Prerequisites

- Node.js 14+ and npm
- MariaDB database server
- MQTT broker (configured on cornelias.pt)

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment configuration:
```bash
cp .env.example .env
```

4. Edit `.env` with your database and MQTT credentials:
```env
DB_HOST=cornelias.pt
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=bikeshare

MQTT_HOST=cornelias.pt
MQTT_PORT=1883
MQTT_USERNAME=your_mqtt_username
MQTT_PASSWORD=your_mqtt_password

PORT=3001
```

5. Set up the database using the provided schema:
```bash
mysql -h cornelias.pt -u your_username -p < schema.sql
```

6. Start the development server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. For mobile development, build and sync with Capacitor:
```bash
npm run build
npx cap add android
npx cap add ios
npx cap sync
```

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Docks
- `GET /api/docks` - Get all docks
- `GET /api/docks/:id` - Get dock by ID
- `GET /api/docks/:id/bikes` - Get dock with bikes
- `POST /api/docks` - Create new dock
- `PUT /api/docks/:id` - Update dock
- `DELETE /api/docks/:id` - Delete dock

### Bikes
- `GET /api/bikes` - Get all bikes
- `GET /api/bikes/:id` - Get bike by ID
- `GET /api/bikes/dock/:dockId` - Get bikes by dock
- `POST /api/bikes` - Create new bike
- `PUT /api/bikes/:id` - Update bike
- `PATCH /api/bikes/:id/status` - Update bike status
- `PATCH /api/bikes/:id/battery` - Update battery level
- `PATCH /api/bikes/:id/charging` - Update charging status
- `DELETE /api/bikes/:id` - Delete bike

### System
- `GET /api/health` - Health check

## MQTT Topics

The system publishes and subscribes to the following MQTT topics:

- `bikeshare/bikes/{bike_id}/status` - Bike status updates
- `bikeshare/bikes/{bike_id}/battery` - Battery level updates
- `bikeshare/bikes/{bike_id}/charging` - Charging status updates
- `bikeshare/docks/{dock_id}/status` - Dock status updates

## Mobile Deployment

### Android
```bash
cd frontend
npm run build
npx cap sync android
npx cap open android
```

### iOS
```bash
cd frontend
npm run build
npx cap sync ios
npx cap open ios
```

## Database Schema

The application uses the following main tables:
- `users` - User information
- `docks` - Docking station details
- `bikes` - Bike information and status
- `rentals` - Rental history (future feature)

See `backend/schema.sql` for the complete database schema.

## Configuration

### Environment Variables

#### Backend
- `DB_HOST` - Database host
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name
- `MQTT_HOST` - MQTT broker host
- `MQTT_USERNAME` - MQTT username
- `MQTT_PASSWORD` - MQTT password
- `PORT` - Server port (default: 3001)

#### Frontend
- `REACT_APP_API_URL` - Backend API URL

## Development

### Running in Development Mode

1. Start the backend:
```bash
cd backend && npm run dev
```

2. Start the frontend:
```bash
cd frontend && npm start
```

3. Access the application at `http://localhost:3000`

### Testing

The backend includes basic API testing. Frontend testing uses React Testing Library.

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

## Production Deployment

1. Build the frontend:
```bash
cd frontend && npm run build
```

2. Configure production environment variables
3. Deploy backend to your server
4. Serve frontend build files
5. Configure reverse proxy (nginx recommended)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
