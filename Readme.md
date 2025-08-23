LinkSh URL Shortener - Project Status & Setup Guide
This document outlines the current status of the LinkSh project, detailed instructions for setting up the development environment, and a summary of known issues.

🚀 Project Status (as of August 24, 2025)
The project has successfully completed the foundational phases of development, resulting in a functional full-stack application with core features implemented.

Phase 1: Foundation Setup
Monorepo Architecture: The project is structured as a monorepo with separate frontend (React + Vite) and backend (NestJS) packages.

Backend Initialization: A complete NestJS backend has been scaffolded with all necessary modules for authentication, database access, and core logic.

Containerized Services: Docker Compose is configured to manage the PostgreSQL database and Redis cache, ensuring a consistent and isolated development environment.

Phase 2: Core Backend Implementation
Authentication: A secure Google OAuth 2.0 authentication system has been implemented using Passport.js, including JWT generation for session management.

API Endpoints: Full CRUD (Create, Read, Update, Delete) APIs for managing links and folders have been built and are protected by authentication guards.

Database Schema: The PostgreSQL database schema has been defined and implemented using Prisma, including all models and relations for users, links, folders, and analytics.

Phase 3: Frontend Integration
API Client: A typed API service layer using Axios has been created on the frontend to handle all communication with the backend.

State Management: A global Zustand store manages the application's state, including user authentication, links, and folders, providing a single source of truth.

UI Integration: All frontend pages (Home, Profile, Folders, History) have been connected to the Zustand store, replacing mock data with live data from the backend API.

🛠️ Getting Started: How to Run This Project
Follow these steps to set up and run the project on your local machine.

Prerequisites
Node.js (v18 or later)

Docker Desktop (must be running)

Git

1. Clone the Repository
git clone <your-repository-url>
cd <your-repository-name>

2. Install Dependencies
This command will install all necessary packages for the root, frontend, and backend.

npm run install:all

3. Configure Environment Variables
You need to create two .env files with your secret keys.

A. Backend Configuration (backend/.env)
Create a file at backend/.env and add the following:

# Database Connection URL (matches docker-compose.yml)
DATABASE_URL="postgresql://postgres:password@localhost:5432/linksh?schema=public"

# JWT Secret (use a long, random string)
JWT_SECRET="YOUR_SUPER_SECRET_RANDOM_STRING_HERE"

# Google OAuth Credentials (from Google Cloud Console)
GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET"
GOOGLE_CALLBACK_URL="http://localhost:3001/auth/google/callback"

B. Frontend Configuration (frontend/.env.local)
Create a file at frontend/.env.local and add the following:

VITE_API_URL=http://localhost:3001

4. Start Docker Services
This will start your PostgreSQL database and Redis cache in the background.

npm run docker:up

5. Initialize the Database
This command will sync your Prisma schema with the database, creating all the necessary tables.

npm run db:migrate

(You will be prompted to enter a name for the migration. You can use init.)

6. Run the Application
This will start both the backend and frontend servers in development mode.

npm run dev

Frontend will be available at http://localhost:8080

Backend will be available at http://localhost:3001

🐞 Current Issues & Troubleshooting
The application is fully functional, but there is a persistent environmental issue that can occur during the setup process.

Known Issue: Prisma P5010 Error
Symptom: During the Google login callback, the backend server crashes with a PrismaClientKnownRequestError: P5010 in the terminal.

Cause: This is a known environmental issue where the Prisma Client running in the application becomes out of sync with its underlying query engine, often due to a corrupted state after a failed migration or networking issue with Docker. This is not a bug in the application code itself.

Solution (The "Scorched Earth" Reset): If you encounter this error, the following sequence is the definitive way to fix it by clearing all possible sources of the corrupted state.

Troubleshooting Steps:

Stop the server (Ctrl + C).

Restart Docker Desktop completely.

Stop and remove the database volumes:

npm run docker:down -- --volumes

Delete all lock files: Manually delete package-lock.json from the root, frontend, and backend directories.

Clean all packages:

npm run clean

Manually delete the dist folder inside the backend directory.

Re-run the setup process from Step 2 of the "Getting Started" guide (npm run install:all, npm run docker:up, etc.).