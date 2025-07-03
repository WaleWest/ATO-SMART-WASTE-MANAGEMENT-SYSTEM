# ATO Smart Waste Management System

## Overview

This is a full-stack smart waste management application built with React, Express, and PostgreSQL. The system allows users to register for waste management services, monitors bin fill levels in real-time, and sends automated alerts when bins need collection. The application features a modern UI built with shadcn/ui components and includes comprehensive API documentation.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **Session Management**: PostgreSQL-based session storage
- **Email Service**: Nodemailer for transactional emails
- **Scheduling**: Node-cron for automated tasks

### Data Storage Solutions
- **Primary Database**: PostgreSQL hosted on Neon
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations
- **Session Storage**: PostgreSQL with connect-pg-simple
- **In-Memory Fallback**: MemStorage class for development

## Key Components

### Database Schema
- **Users Table**: Stores user registration information including name, email, address, and bin type
- **Bins Table**: Tracks bin locations, capacities, fill levels, and status
- **Alerts Table**: Manages system alerts for bin collection needs
- **Settings Table**: Configurable system parameters like alert thresholds

### API Endpoints
- **POST /api/users/register**: User registration with automatic bin assignment
- **GET /api/bins**: Real-time bin monitoring data
- **GET /api/settings**: System configuration retrieval
- **PUT /api/settings**: System configuration updates

### Services
- **BinService**: Handles bin level simulation and alert generation
- **EmailService**: Manages transactional email notifications
- **Storage Service**: Abstracts database operations with interface pattern

### UI Components
- **RegistrationForm**: Multi-step user registration with validation
- **BinMonitor**: Real-time dashboard for bin status monitoring
- **SettingsPanel**: Administrative interface for system configuration
- **ApiDocumentation**: Interactive API reference guide

## Data Flow

1. **User Registration**: Users submit registration form → validation → database storage → bin creation → email confirmation
2. **Bin Monitoring**: Automated cron jobs simulate fill level increases → alert generation → email notifications
3. **Real-time Updates**: Frontend polls API every 30 seconds → UI updates with latest bin status
4. **Settings Management**: Admin updates system settings → immediate application across all monitoring logic

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe database operations
- **nodemailer**: Email service integration
- **node-cron**: Scheduled task execution

### UI Dependencies
- **@radix-ui**: Accessible component primitives
- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form handling and validation
- **tailwindcss**: Utility-first CSS framework
- **zod**: Schema validation library

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Static type checking
- **esbuild**: Fast JavaScript bundler for production

## Deployment Strategy

### Development Environment
- **Frontend**: Vite development server with HMR
- **Backend**: tsx for TypeScript execution with auto-restart
- **Database**: Neon PostgreSQL with connection pooling

### Production Build
- **Frontend**: Vite build with static asset optimization
- **Backend**: esbuild bundle for Node.js deployment
- **Database**: Drizzle migrations with production schema

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string
- **SMTP_***: Email service configuration
- **NODE_ENV**: Environment-specific behavior

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- July 03, 2025. Initial setup