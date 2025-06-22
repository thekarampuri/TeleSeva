# 🏥 TeleSeva - Comprehensive Telemedicine Platform

<div align="center">

![TeleSeva Logo](https://img.shields.io/badge/TeleSeva-Healthcare%20Platform-blue?style=for-the-badge&logo=medical-cross)

**Your Health, Our Priority** - A revolutionary telemedicine platform democratizing healthcare access

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-11.9.1-orange?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com/)

</div>

## 🌟 About TeleSeva

**TeleSeva** is a cutting-edge telemedicine platform developed for **HackStorm**, designed to bridge the gap between patients and healthcare providers through innovative technology. Our platform combines the power of AI, real-time communication, and modern web technologies to deliver comprehensive healthcare services accessible from anywhere, anytime.

### 🏆 Hackathon Project Details

- **Event**: HackStorm - Premier Healthcare Innovation Hackathon
- **Team**: **DeepShip**
- **Developers**: **Omkarr Gondkar** & **Akhil Karampuri**
- **Category**: Healthcare Technology & Telemedicine
- **Duration**: 48-hour intensive development sprint
- **Theme**: Democratizing Healthcare Access Through Technology

### 🎯 Problem Statement

In today's fast-paced world, accessing quality healthcare remains a significant challenge:
- **Geographic Barriers**: Remote areas lack adequate medical facilities
- **Time Constraints**: Long waiting times and appointment scheduling issues
- **Cost Factors**: High consultation fees and travel expenses
- **Emergency Situations**: Immediate medical guidance not readily available
- **Medication Management**: Difficulty in prescription management and medicine delivery

### 💡 Our Solution

TeleSeva addresses these challenges through a comprehensive digital healthcare ecosystem that provides:
- **Instant Medical Consultations** via video, audio, or chat
- **AI-Powered Symptom Analysis** using Google Gemini API
- **Smart Medicine Management** with OCR prescription scanning
- **Emergency Healthcare Services** with rapid response
- **Healthcare Facility Locator** with real-time availability
- **Secure Health Records Management** with Firebase integration

## 📸 Application Screenshots

### Authentication & Onboarding
![Authentication Page](screenshots/Screenshot%202025-06-22%20211856.png)
*Modern authentication interface with role-based access (Patient/Doctor) and team attribution*

### Patient Dashboard
![Patient Dashboard](screenshots/Screenshot%202025-06-22%20211919.png)
*Comprehensive dashboard with quick access to all healthcare services*

### Doctor Consultation Platform
![Symptom Checker](screenshots/Screenshot%202025-06-22%20211937.png)
*Intelligent symptom analysis with voice input and real-time AI responses*

### AI-Powered Symptom Checker
![Doctor Consultation](screenshots/Screenshot%202025-06-22%20212033.png)
*Professional consultation booking with verified doctors and multiple communication modes*

### Health Facility Finder
![Medicine Management](screenshots/Screenshot%202025-06-22%20212101.png)
*Smart prescription management with OCR scanning and delivery tracking*

## 🚀 Key Features & Innovations

### 🔬 AI-Powered Healthcare
- **Intelligent Symptom Checker**: Advanced AI using Google Gemini API for accurate symptom analysis
- **Voice-Enabled Interface**: Natural language processing for hands-free interaction
- **Smart Recommendations**: Personalized health suggestions based on user data
- **Predictive Analytics**: Early warning systems for potential health issues

### 👨‍⚕️ Professional Medical Services
- **Verified Doctor Network**: Comprehensive database of certified healthcare professionals
- **Multi-Modal Consultations**: Video, audio, and text-based consultation options
- **Specialty Matching**: Automatic doctor-patient matching based on medical needs
- **Real-Time Availability**: Live doctor availability status and instant booking

### 💊 Smart Medicine Management
- **OCR Prescription Scanning**: Advanced text recognition for digital and handwritten prescriptions
- **Alternative Medicine Suggestions**: AI-powered recommendations for generic alternatives
- **Delivery Integration**: Seamless medicine delivery with real-time tracking
- **Medication Reminders**: Smart notification system for medication adherence

### 🚨 Emergency Healthcare Services
- **Rapid Response System**: Immediate connection to emergency medical services
- **Location-Based Services**: GPS integration for nearest facility recommendations
- **Emergency Contact Management**: Quick access to emergency contacts and medical history
- **Critical Alert System**: Automated alerts for severe symptoms or conditions

### 🏥 Healthcare Facility Network
- **Comprehensive Facility Database**: Extensive network of hospitals, clinics, and pharmacies
- **Real-Time Availability**: Live updates on facility capacity and services
- **Route Optimization**: Smart navigation to nearest healthcare facilities
- **Service Filtering**: Advanced search by specialty, insurance, and services offered

## 🏗️ Project Architecture

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

## 🚀 Getting Started - Complete Setup Guide

### 📋 Prerequisites

Before running TeleSeva, ensure you have the following installed:

- **Node.js**: Version 18.0 or higher ([Download](https://nodejs.org/))
- **npm**: Comes with Node.js (or use pnpm for better performance)
- **Git**: For version control ([Download](https://git-scm.com/))
- **Modern Web Browser**: Chrome, Firefox, Safari, or Edge
- **Firebase Account**: For backend services ([Create Account](https://firebase.google.com/))

### 🔧 Installation & Setup

#### Step 1: Clone the Repository
```bash
# Clone the TeleSeva repository
git clone https://github.com/your-username/TeleSeva.git
cd TeleSeva
```

#### Step 2: Install Dependencies
```bash
# Navigate to client directory
cd client

# Install all required dependencies
npm install

# Alternative: Use pnpm for faster installation
# npm install -g pnpm
# pnpm install
```

#### Step 3: Environment Configuration
```bash
# Create environment file in client directory
cd client
touch .env.local

# Add the following environment variables to .env.local:
```

#### Step 4: Firebase Setup
1. **Create Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project named "TeleSeva"
   - Enable Authentication, Firestore, and Storage

2. **Configure Authentication**:
   - Enable Email/Password authentication
   - Add localhost:3000 to authorized domains

3. **Setup Firestore Database**:
   - Create database in test mode
   - The app will automatically create required collections

#### Step 5: Run the Application
```bash
# Navigate to client directory (if not already there)
cd client

# Start the development server
npm run dev

# Alternative commands:
# npm run build    # Build for production
# npm run start    # Start production server
# npm run lint     # Run ESLint
```

#### Step 6: Access the Application
- **Local Development**: http://localhost:3000
- **Default Route**: Authentication page (as configured)
- **Guest Access**: Available via "Continue as Guest" button

### 🎯 Quick Start Commands

```bash
# Complete setup in one go
git clone https://github.com/your-username/TeleSeva.git
cd TeleSeva/client
npm install
npm run dev
```

### 🔍 Verification Steps

1. **Check Installation**:
   ```bash
   node --version    # Should show v18.0+
   npm --version     # Should show latest version
   ```

2. **Verify Application**:
   - Open http://localhost:3000
   - Should see TeleSeva authentication page
   - Try guest access to explore features
   - Test symptom checker with voice input

3. **Check Firebase Connection**:
   - Try creating a test account
   - Verify data appears in Firebase Console
   - Test authentication flow

## 🛠️ Technology Stack

### 🎨 Frontend Technologies
- **Framework**: Next.js 15.2.4 with App Router - Modern React framework with server-side rendering
- **Language**: TypeScript 5.0 - Type-safe JavaScript for better development experience
- **Styling**: Tailwind CSS 3.4.17 - Utility-first CSS framework for rapid UI development
- **UI Components**:
  - Radix UI - Unstyled, accessible components
  - shadcn/ui - Beautiful, customizable component library
  - Framer Motion - Smooth animations and transitions
- **State Management**: React Context API - Built-in state management solution
- **Icons**: Lucide React - Beautiful, customizable SVG icons

### 🔥 Backend & Services
- **Authentication**: Firebase Auth 11.9.1 - Secure user authentication and authorization
- **Database**: Firebase Firestore - Real-time NoSQL database with offline support
- **Storage**: Firebase Storage - Secure file storage for prescriptions and documents
- **Analytics**: Firebase Analytics - User behavior tracking and insights
- **AI Integration**: Google Gemini API - Advanced AI for symptom analysis and recommendations

### 🚀 Development & Deployment
- **Package Manager**: npm/pnpm - Fast, reliable dependency management
- **Build Tool**: Next.js built-in bundler with Webpack 5
- **Linting**: ESLint with TypeScript rules
- **Code Formatting**: Prettier for consistent code style
- **Deployment**: Vercel - Optimized for Next.js applications
- **Version Control**: Git with GitHub integration

### 📱 Additional Integrations
- **Voice Recognition**: Web Speech API for voice-enabled features
- **Text-to-Speech**: Browser native TTS for accessibility
- **OCR Technology**: Advanced text recognition for prescription scanning
- **Geolocation**: Browser Geolocation API for facility finder
- **Real-time Communication**: WebRTC for video consultations

### 🌍 Production Considerations

1. **Environment Variables**: Ensure all production environment variables are set
2. **Firebase Security**: Configure Firestore security rules for production
3. **Domain Configuration**: Add your domain to Firebase authorized domains
4. **Performance**: Enable Next.js optimizations and CDN
5. **Monitoring**: Set up error tracking and performance monitoring

## 🎯 Core Features & Capabilities

### 🏥 Comprehensive Healthcare Services
- **Telemedicine Consultations**: High-quality video, audio, and chat consultations with verified doctors
- **AI-Powered Symptom Checker**: Advanced symptom analysis using Google Gemini API with voice input support
- **Smart Medicine Management**: OCR prescription scanning, alternative medicine suggestions, and delivery tracking
- **Emergency Healthcare Services**: Rapid response system with location-based emergency facility finder
- **Healthcare Facility Locator**: Real-time facility availability with route optimization and service filtering
- **Digital Health Records**: Secure, comprehensive health data management and visualization
- **Intelligent Notifications**: Smart alerts for appointments, medications, and health reminders

### 🔐 Security & Authentication
- **Role-Based Access Control**: Separate interfaces for patients and healthcare providers
- **Firebase Authentication**: Enterprise-grade security with multi-factor authentication support
- **Data Encryption**: End-to-end encryption for all sensitive medical data
- **HIPAA Compliance**: Healthcare data protection standards implementation
- **Guest Mode**: Secure temporary access for immediate healthcare needs

### 🤖 AI & Machine Learning
- **Natural Language Processing**: Advanced conversation capabilities for symptom analysis
- **Voice Recognition**: Hands-free interaction with speech-to-text conversion
- **Predictive Analytics**: Early warning systems for potential health issues
- **Smart Recommendations**: Personalized health suggestions based on user history
- **OCR Technology**: Advanced text recognition for digital and handwritten prescriptions

### 📱 User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Progressive Web App**: App-like experience with offline capabilities
- **Accessibility Features**: Screen reader support, keyboard navigation, and high contrast modes
- **Multi-language Support**: Localization for diverse user base
- **Real-time Updates**: Live notifications and data synchronization

### 📊 Performance Optimization

- **Image Optimization**: Use Next.js Image component for automatic optimization
- **Code Splitting**: Leverage Next.js automatic code splitting
- **Caching**: Implement proper caching strategies for API calls
- **Bundle Analysis**: Use `npm run build` to analyze bundle size
- **Lighthouse Scores**: Aim for 90+ scores in all categories

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
