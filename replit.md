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
Required environment variables are configured:
- `PORT`: Backend server port (4005)
- `MONGO_URI`: MongoDB Atlas connection string (configured)
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

## Database Seeding
Run `npm run seed` to populate the database with sample data:
- **8 Templates**: One for each combination of honor type and event type
- **16 Honors**: 2 sample certificates/badges for each template
- **8 Recipients**: Sample recipient profiles

### Honor Types
- CERTIFICATE (1): Full certificates with signature blocks and seals
- BADGE (2): Compact digital badges

### Event Types
- COURSE (1): Course completion certificates/badges
- EXAM (2): Exam achievement certificates/badges
- PARTICIPATION (3): Event participation certificates/badges
- CUSTOM (4): Custom achievement certificates/badges

## Frontend Pages
- **Home** (`/`): Landing page
- **All Certificates** (`/certificates`): View all certificates and badges with filtering
- **All Templates** (`/templates`): View all templates with filtering
- **My Certificates** (`/my-certificates`): User's personal certificates (by email)
- **Public Certificate** (`/c/:slug`): Public shareable certificate view
- **Template Preview** (`/preview/:id`): Preview a specific template

## Recent Changes (Dec 5, 2024)
- Migrated from GitHub to Replit environment
- Created Vite configuration with proper host settings (0.0.0.0:5000) for Replit proxy
- Updated backend to bind to localhost to avoid port conflicts
- Fixed React routing to use proper Wouter Route components
- Configured environment variables for development
- Created unified startup script for all services
- Configured deployment settings for production
- Added database seeding script with sample templates and certificates
- Added All Certificates and All Templates pages with filtering
- Configured PDF generation with Puppeteer using system Chromium
- Integrated AWS S3 for certificate PDF and image storage
- Seeding now auto-generates PDFs and uploads to S3

## AWS S3 Configuration
The following environment variables are configured:
- `AWS_ACCESS_KEY_ID`: (stored as secret)
- `AWS_SECRET_ACCESS_KEY`: (stored as secret)
- `AWS_REGION`: eu-north-1
- `AWS_S3_BUCKET`: nexsaaportal

### Signed URLs
Certificate assets use **signed S3 URLs** for secure access:
- Database stores S3 object keys (e.g., `certificates/{id}.pdf`)
- API generates signed URLs on-the-fly with **10-minute expiry**
- No public bucket access required - all access is authenticated
- URLs are regenerated on each request for security

## Notes
- PDF generation uses Puppeteer with system-installed Chromium
- The worker process (Agenda) handles background jobs for certificate generation
- MongoDB Atlas is used as the cloud database
- S3 bucket should have appropriate bucket policy for public read access to certificates
