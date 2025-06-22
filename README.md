# TeleSeva - Telemedicine Platform

A comprehensive telemedicine platform built with Next.js, TypeScript, and Firebase, providing healthcare services including consultations, symptom checking, medicine management, and emergency services.

## 🏗️ Project Structure

```
Hackstorm/
├── client/                          # Frontend Next.js application
│   ├── app/                         # Next.js App Router pages
│   │   ├── auth/                    # Authentication pages
│   │   ├── consultation/            # Video consultation features
│   │   ├── disease-alerts/          # Disease alert system
│   │   ├── emergency/               # Emergency services
│   │   ├── facility-finder/         # Healthcare facility locator
│   │   ├── medicine/                # Medicine management
│   │   ├── notifications/           # Notification system
│   │   ├── reports/                 # Health reports
│   │   ├── symptom-checker/         # AI-powered symptom checker
│   │   ├── globals.css              # Global styles
│   │   ├── layout.tsx               # Root layout component
│   │   └── page.tsx                 # Home page
│   ├── components/                  # Reusable React components
│   │   ├── auth/                    # Authentication components
│   │   ├── layout/                  # Layout components
│   │   ├── ui/                      # UI components (shadcn/ui)
│   │   └── theme-provider.tsx       # Theme provider
│   ├── contexts/                    # React contexts
│   │   └── AuthContext.tsx          # Authentication context
│   ├── hooks/                       # Custom React hooks
│   │   ├── use-mobile.tsx           # Mobile detection hook
│   │   └── use-toast.ts             # Toast notification hook
│   ├── lib/                         # Utility libraries
│   │   ├── firebase.ts              # Firebase configuration
│   │   ├── location.ts              # Location utilities
│   │   ├── places.ts                # Places API utilities
│   │   └── utils.ts                 # General utilities
│   ├── public/                      # Static assets
│   │   └── images/                  # Image assets
│   ├── styles/                      # Additional styles
│   ├── components.json              # shadcn/ui configuration
│   ├── next.config.mjs              # Next.js configuration
│   ├── package.json                 # Frontend dependencies
│   ├── tailwind.config.ts           # Tailwind CSS configuration
│   └── tsconfig.json                # TypeScript configuration
├── server/                          # Backend Node.js application
│   ├── src/                         # Source code
│   │   ├── api/                     # API routes and controllers
│   │   ├── config/                  # Configuration files
│   │   ├── models/                  # Data models
│   │   ├── services/                # Business logic services
│   │   ├── utils/                   # Server utilities
│   │   └── index.ts                 # Server entry point
│   ├── package.json                 # Backend dependencies
│   └── tsconfig.json                # TypeScript configuration
├── shared/                          # Shared code between client and server
│   ├── schemas/                     # Shared data schemas
│   └── utils/                       # Shared utilities
├── docs/                            # Documentation
├── scripts/                         # Build and deployment scripts
├── package.json                     # Root package.json
├── pnpm-lock.yaml                   # Package lock file
└── tsconfig.json                    # Root TypeScript configuration
```

## 🔥 Firebase Configuration

The project is properly configured with Firebase for authentication, database, storage, and analytics. The configuration is located in `client/lib/firebase.ts`:

### Firebase Services Used:
- **Authentication**: User login/signup and session management using Firebase Auth
- **Firestore Database**: Real-time NoSQL database for application data
- **Storage**: File uploads and media storage using Firebase Storage
- **Analytics**: User behavior tracking and insights

### Configuration Details:
- **Project ID**: teleseva-7e1c4
- **Auth Domain**: teleseva-7e1c4.firebaseapp.com
- **Storage Bucket**: teleseva-7e1c4.firebasestorage.app

### Database Structure:
The Firestore database includes collections for:
- `users` - User profiles and account information
- `consultations` - Video consultation records
- `appointments` - Scheduled appointments
- `healthRecords` - Patient health records and history
- `medications` - Prescription and medication tracking
- `symptoms` - Symptom checker data
- `facilities` - Healthcare facility information
- `notifications` - User notifications
- `reports` - Health reports and analytics
- `emergencyContacts` - Emergency contact information

### Firestore Utilities:
A comprehensive Firestore service is available in `client/lib/firestore.ts` with:
- Generic CRUD operations
- Real-time subscriptions
- Query builders with filtering and pagination
- Type-safe operations with TypeScript
- Service-specific functions for users, consultations, and appointments

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Firebase account and project setup

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Hackstorm
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   pnpm install

   # Install client dependencies
   cd client
   pnpm install

   # Install server dependencies
   cd ../server
   pnpm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env.local` in the client directory
   - Add your Firebase configuration and other environment variables

4. **Run the development servers**
   ```bash
   # Run client (from client directory)
   cd client
   pnpm dev

   # Run server (from server directory)
   cd server
   pnpm dev
   ```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.2.4 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: React Context
- **Authentication**: Firebase Auth
- **Analytics**: Firebase Analytics

### Backend
- **Runtime**: Node.js
- **Language**: TypeScript
- **Database**: Firebase Firestore (NoSQL)
- **Authentication**: Firebase Admin SDK
- **Alternative**: MongoDB with Mongoose (currently configured in server)

### Development Tools
- **Package Manager**: pnpm
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Build Tool**: Next.js built-in bundler

## 📱 Features

- **🏥 Telemedicine Consultations**: Video calls with healthcare providers
- **🔍 Symptom Checker**: AI-powered symptom analysis
- **💊 Medicine Management**: Prescription tracking and reminders
- **🚨 Emergency Services**: Quick access to emergency care
- **🏢 Facility Finder**: Locate nearby healthcare facilities
- **📊 Health Reports**: Personal health data visualization
- **🔔 Notifications**: Real-time health alerts and reminders
- **🔐 Secure Authentication**: Firebase-powered user management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions, please open an issue in the GitHub repository or contact the development team.
