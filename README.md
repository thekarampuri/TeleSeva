# TeleSeva - Healthcare Platform

## Project Structure

This project follows a clean client-server architecture with Firebase as the backend database.

```
├── client/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/           # Next.js 13+ app directory
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── contexts/      # React contexts
│   │   ├── lib/           # Client-side utilities and Firebase config
│   │   └── styles/        # Global styles and CSS
│   ├── public/            # Static assets
│   └── package.json       # Client dependencies
│
├── server/                # Backend API and services
│   ├── src/
│   │   ├── api/           # API routes and controllers
│   │   ├── services/      # Business logic services
│   │   ├── models/        # Data models and schemas
│   │   ├── middleware/    # Express middleware
│   │   ├── config/        # Server configuration
│   │   └── utils/         # Server utilities
│   └── package.json       # Server dependencies
│
├── shared/                # Shared code between client and server
│   ├── types/             # TypeScript type definitions
│   ├── constants/         # Shared constants
│   ├── utils/             # Shared utility functions
│   └── schemas/           # Validation schemas
│
├── docs/                  # Documentation
└── scripts/               # Build and deployment scripts
```

## Getting Started

### Prerequisites
- Node.js 18+
- Firebase project setup

### Installation

1. Install dependencies for both client and server:
```bash
# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install
```

2. Set up environment variables (see .env.example files)

3. Start development servers:
```bash
# Start client (from client directory)
npm run dev

# Start server (from server directory)
npm run dev
```

## Firebase Configuration

This project uses Firebase for:
- Authentication
- Firestore Database
- Cloud Storage
- Analytics

## Scripts

- `npm run dev:client` - Start client development server
- `npm run dev:server` - Start server development server
- `npm run build:client` - Build client for production
- `npm run build:server` - Build server for production
