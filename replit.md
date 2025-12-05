# NexSAA Honors - Certificate Management System

## Overview
A fullstack application for managing and displaying digital certificates and honors. Built with React frontend, Express backend, MongoDB database, and integrated with AWS S3 for asset storage and Puppeteer for PDF generation.

## Project Structure
- **client/**: React frontend application (Vite + TypeScript)
  - `src/pages/`: Page components (Landing, PublicCertificate, MyCertificates, TemplatePreview)
  - `src/App.tsx`: Main app with Wouter routing
  - `vite.config.ts`: Vite configuration for development server

- **server/**: Express backend API (TypeScript)
  - `controllers/`: API controllers for honors, recipients, templates
  - `models/`: Mongoose models (Honor, Recipient, Template, TemplateVersion)
  - `routes/`: API route definitions
  - `services/`: Business logic (PDF generation, S3 storage, template rendering)
  - `index.ts`: Main server entry point
  - `worker.ts`: Background job worker using Agenda

- **shared/**: Shared types and utilities between frontend and backend

## Technology Stack
- **Frontend**: React 18, Vite 5, Wouter (routing), Axios
- **Backend**: Express, TypeScript, Node.js
- **Database**: MongoDB (with Mongoose ODM)
- **Storage**: AWS S3
- **PDF Generation**: Puppeteer
- **Background Jobs**: Agenda
- **Build Tools**: Vite, esbuild, TypeScript

## Development Setup
1. Dependencies are installed via npm
2. MongoDB runs locally on port 27017
3. Backend API runs on localhost:4005
4. Frontend dev server runs on 0.0.0.0:5000
5. The `start-dev.sh` script orchestrates all services

## Environment Variables
Required environment variables are configured in the development environment:
- `PORT`: Backend server port (4005)
- `MONGO_URI`: MongoDB connection string
- `AWS_S3_BUCKET`, `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`: S3 credentials (need user configuration)
- `HONORS_PUBLIC_URL`: Base URL for public certificate links
- Various other settings for worker, Puppeteer, JWT, etc.

## Running the Application
The application starts automatically via the configured workflow that:
1. Starts MongoDB if not running
2. Starts the Express backend server
3. Starts the Vite frontend dev server

## Deployment
Configured for VM deployment:
- Build step compiles both frontend and backend
- Production runs MongoDB, worker process, and main server

## Recent Changes (Dec 5, 2024)
- Migrated from GitHub to Replit environment
- Created Vite configuration with proper host settings (0.0.0.0:5000) for Replit proxy
- Updated backend to bind to localhost to avoid port conflicts
- Installed MongoDB system package
- Fixed React routing to use proper Wouter Route components
- Configured environment variables for development
- Created unified startup script for all services
- Configured deployment settings for production
- Updated TypeScript config to support JSX

## Notes
- The application uses AWS S3 for storing certificate PDFs and images - users need to configure their own S3 credentials
- Puppeteer is used for generating certificate PDFs from templates
- The worker process (Agenda) handles background jobs for certificate generation
- MongoDB data is stored in `/home/runner/mongodb-data`
